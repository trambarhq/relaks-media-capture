import { EventEmitter } from 'relaks-event-emitter';
import { MediaCaptureError } from './media-capture-error.mjs';
import { MediaCaptureEvent } from './media-capture-event.mjs';

const defaultOptions = {
  video: true,
  audio: true,
  preferredDevice: 'front',
  chooseNewDevice: true,
  captureImageOnly: false,
  watchVolume: false,
  segmentDuration: undefined,
  videoMIMEType: 'video/webm',
  audioMIMEType: 'audio/webm',
  imageMIMEType: 'image/jpeg',
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 2500000,
  silent: false,
};

class RelaksMediaCapture extends EventEmitter {
  constructor(options) {
    super();
    this.options = {};
    this.status = undefined;
    this.duration = undefined;
    this.volume = undefined;
    this.liveVideo = undefined;
    this.liveAudio = undefined;
    this.capturedVideo = undefined;
    this.capturedAudio = undefined;
    this.capturedImage = undefined;
    this.lastError = null;
    this.devices = [];
    this.chosenDeviceID = undefined;

    this.stream = undefined;
    this.audioProcessor = undefined;
    this.audioContext = undefined;
    this.audioSource = undefined;
    this.mediaRecorder = null;
    this.mediaRecorderStartTime = null;
    this.mediaRecorderDuration = 0
    this.mediaRecorderInterval = 0;
    this.mediaRecorderBlobs = [];
    this.orientationChanged = false;
    this.videoDimensions = null;

    this.handleDeviceChange = this.handleDeviceChange.bind(this);
    this.handleStreamEnd = this.handleStreamEnd.bind(this);
    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handleMediaRecorderData = this.handleMediaRecorderData.bind(this);
    this.handleMediaRecorderStart = this.handleMediaRecorderStart.bind(this);
    this.handleMediaRecorderStop = this.handleMediaRecorderStop.bind(this);
    this.handleMediaRecorderPause = this.handleMediaRecorderPause.bind(this);
    this.handleMediaRecorderResume = this.handleMediaRecorderResume.bind(this);
    this.handleMediaRecorderInterval = this.handleMediaRecorderInterval.bind(this);
    this.handleOrientationChange = this.handleOrientationChange.bind(this);
    this.handleResize = this.handleResize.bind(this);

    for (let name in defaultOptions) {
      if (options && options[name] !== undefined) {
        this.options[name] = options[name];
      } else {
        this.options[name] = defaultOptions[name];
      }
    }
  }

  /**
   * Begin the capturing process, first by acquiring a recording device.
   * Capturing won't start until start() is called
   */
  activate() {
    if (!this.active) {
      if (this.capturedVideo || this.capturedAudio || this.capturedImage) {
        // can't reactivate without calling clear() first
        return;
      }
      this.acquire();
      this.active = true;
      this.notifyChange();
      this.watchDevices();
    }
  }

  /**
   * End the capturing process, release the recording device and free
   *
   */
  deactivate() {
    if (this.active) {
      if (this.mediaRecorder) {
        clearInterval(this.mediaRecorderInterval);
        this.mediaRecorder.removeEventListener('dataavailable', this.handleMediaRecorderData);
        this.mediaRecorder.removeEventListener('start', this.handleMediaRecorderStart);
        this.mediaRecorder.removeEventListener('stop', this.handleMediaRecorderStop);
        this.mediaRecorder.removeEventListener('pause', this.handleMediaRecorderPause);
        this.mediaRecorder.removeEventListener('resume', this.handleMediaRecorderResume);
        this.mediaRecorder.stop();
        this.mediaRecorder = null;
        this.mediaRecorderStartTime = null;
        this.mediaRecorderDuration = 0
        this.mediaRecorderInterval = 0;
        this.mediaRecorderBlobs = [];
      }

      this.releaseInput();
      this.revokeBlobURLs();
      this.unwatchDevices();
      this.active = false;
      this.notifyChange();
    }
  }

  /**
   * Acquire an input device
   *
   * @return {Promise}
   */
  acquire() {
    if (!this.status) {
      this.status = 'acquiring';
    }
    const constraints = {
      video: this.options.video,
      audio: this.options.audio,
    };
    return getDevices(constraints).then((devices) => {
      const preferred = this.chosenDeviceID || this.options.preferredDevice;
      const device = chooseDevice(devices, preferred);
      if (device) {
        const criteria = { deviceId: device.id };
        if (constraints.video) {
          constraints.video = criteria;
        } else if (constraints.audio) {
          constraints.audio = criteria;
        }
      }
      return getMediaStream(constraints).then((stream) => {
        // stop all tracks
        this.status = 'initiating';
        this.devices = devices;
        this.chosenDeviceID = (device) ? device.id : undefined;
        this.notifyChange();

        if (constraints.video) {
          return getVideoStreamMeta(stream).then((meta) => {
            const { width, height } = meta;
            this.stream = stream;
            this.liveVideo = { stream, height, width };
            if (this.options.watchVolume && constraints.audio) {
              this.watchAudioVolume();
            }
            this.watchStreamStatus();
            this.status = 'previewing';
            this.notifyChange();
          });
        } else if (constraints.audio) {
          this.stream = stream;
          this.liveAudio = { stream };
          if (this.options.watchVolume) {
            this.watchAudioVolume();
          }
          this.watchStreamStatus();
          this.status = 'previewing';
          this.notifyChange();
        }
      });
    }).catch((err) => {
      this.status = 'denied';
      this.saveError(err);
      this.notifyChange();
      return null;
    });
  }

  /**
   * Start capturing video/audio
   */
  start() {
    try {
      if (this.mediaRecorder) {
        return;
      }
      const options = {};
      if (this.options.audio) {
        options.audioBitsPerSecond = this.options.audioBitsPerSecond;
        options.mimeType = this.options.audioMIMEType;
      }
      if (this.options.video) {
        options.videoBitsPerSecond = this.options.videoBitsPerSecond,
        options.mimeType = this.options.videoMIMEType;
      }
      if (this.liveVideo) {
        this.videoDimensions = {
          width: this.liveVideo.width,
          height: this.liveVideo.height,
        };
      }
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.mediaRecorder.addEventListener('dataavailable', this.handleMediaRecorderData);
      this.mediaRecorder.addEventListener('start', this.handleMediaRecorderStart);
      this.mediaRecorder.addEventListener('stop', this.handleMediaRecorderStop);
      this.mediaRecorder.addEventListener('pause', this.handleMediaRecorderPause);
      this.mediaRecorder.addEventListener('resume', this.handleMediaRecorderResume);
      this.mediaRecorder.start(this.options.segmentDuration);
    } catch (err) {
      this.saveError(err);
    }
  }

  /**
   * Stop capturing video/audio
   */
  stop() {
    try {
      this.mediaRecorder.stop();
    } catch (err) {
      this.saveError(err);
    }
  }

  /**
   * Pause recording
   */
  pause() {
    try {
      this.mediaRecorder.pause();
    } catch (err) {
      this.saveError(err);
    }
  }

  /**
   * Resume recording
   */
  resume() {
    try {
      this.mediaRecorder.resume();
    } catch (err) {
      this.saveError(err);
    }
  }

  /**
   * Capture a snapshot of the video input
   */
  snap() {
    try {
      const mimeType = this.options.imageMIMEType;
      const quality = this.options.imageQuality || 90;
      const imageOnly = this.options.captureImageOnly;
      if (!this.liveVideo) {
        throw new MediaCaptureError('No video stream');
      }
      getVideoStreamSnapshot(this.stream).then((canvas) => {
        return saveCanvasContents(canvas, mimeType, quality).then((blob) => {
          const { width, height } = canvas;
          const url = URL.createObjectURL(blob);
          this.capturedImage = { url, blob, width, height };
          if (imageOnly) {
            this.status = 'captured';
          }
          this.notifyChange();
        });
      });
    } catch (err) {
      this.saveError(err);
    }
  }

  /**
   * Keep an eye out for device addition/removal
   */
  watchDevices() {
    const { mediaDevices } = navigator;
    if (mediaDevices && mediaDevices.addEventListener) {
      mediaDevices.addEventListener('devicechange', this.handleDeviceChange);
    }
    window.addEventListener('orientationchange', this.handleOrientationChange);
    window.addEventListener('resize', this.handleResize);
  }

  unwatchDevices() {
    const { mediaDevices } = navigator;
    if (mediaDevices && mediaDevices.removeEventListener) {
      mediaDevices.removeEventListener('devicechange', this.handleDeviceChange);
    }
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    window.removeEventListener('resize', this.handleResize);
  }

  /**
   * Keep an eye on the input stream
   */
  watchStreamStatus() {
    const tracks = this.stream.getTracks();
    for (let track of tracks) {
      track.onended = this.handleStreamEnd;
    }
  }

  /**
   * Remove event handlers from the input stream
   */
  unwatchStreamStatus() {
    const tracks = this.stream.getTracks();
    for (let track of tracks) {
      track.onended = null;
    }
  }

  /**
   * Keep an eye on the audio volume
   */
  watchAudioVolume() {
    if (typeof(AudioContext) === 'function')  {
      this.audioContext = new AudioContext();
      this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
      this.audioSource = this.audioContext.createMediaStreamSource(this.stream);
      this.audioProcessor.addEventListener('audioprocess', this.handleAudioProcess);
      this.audioSource.connect(this.audioProcessor);
      this.audioProcessor.connect(this.audioContext.destination);
    }
  }

  /**
   * Destroy audio processor used to monitor volume
   */
  unwatchAudioVolume() {
    if (this.audioContext) {
      this.audioProcessor.disconnect(this.audioContext.destination);
      this.audioSource.disconnect(this.audioProcessor);
      this.audioProcessor.removeEventListener('audioprocess', this.handleAudioProcess);
      this.audioContext = undefined;
      this.audioSource = undefined;
      this.audioProcessor = undefined;
    }
    this.volume = undefined;
  }

  /**
   * Release recording device
   */
  releaseInput() {
    if (this.stream) {
      this.unwatchAudioVolume();
      this.unwatchStreamStatus();
      stopMediaStream(this.stream);
      this.stream = undefined;
      this.liveVideo = undefined;
      this.liveAudio = undefined;
    }
  }

  /**
   * Revoke the blob URL of captured media and set them to undefined
   */
  revokeBlobURLs() {
    if (this.capturedVideo) {
      URL.revokeObjectURL(this.capturedVideo.url);
      this.capturedVideo = undefined;
    }
    if (this.capturedAudio) {
      URL.revokeObjectURL(this.capturedAudio.url);
      this.capturedAudio = undefined;
    }
    if (this.capturedImage) {
      URL.revokeObjectURL(this.capturedImage.url);
      this.capturedImage = undefined;
    }
  }

  /**
   * Obtain an input device again
   *
   * @return {Promise}
   */
  reacquire() {
    this.status = 'initiating';
    this.releaseInput();
    this.notifyChange();
    return this.acquire();
  }

  /**
   * Select a new input device
   *
   * @param  {Number} deviceID
   *
   * @return {Promise}
   */
  choose(deviceID) {
    try {
      if (this.chosenDeviceID === deviceID && this.stream) {
        return Promise.resolve();
      }
      this.chosenDeviceID = deviceID;
      return this.reacquire();
    } catch (err) {
      this.saveError(err);
      return Promise.reject(err);
    }
  }

  /**
   * Clear what has been captured
   */
  clear() {
    this.revokeBlobURLs();
    if (this.liveVideo || this.liveAudio) {
      this.status = 'previewing';
    } else {
      this.status = undefined;
      if (this.active) {
        this.acquire();
      }
    }
    this.duration = undefined;
    this.notifyChange();
  }

  /**
   * Wait for change to occur
   *
   * @return {Promise<Event>}
   */
  change() {
    return this.waitForEvent('change');
  }

  /**
   * Fulfill promise returned by change() and emit a change event
   */
  notifyChange() {
    this.triggerEvent(new MediaCaptureEvent('change', this));
  }

  /**
   * Save the last error, dumping it into the console optionally
   *
   * @param {[type]} err
   */
  saveError(err) {
    this.lastError = err;
    if (!this.options.silent) {
      console.error(err);
    }
  }

  /**
   * Called when a device is plugged in or unplugged
   *
   * @param  {Event} evt
   */
  handleDeviceChange(evt) {
    if (this.scanningDevices) {
      return;
    }
    this.scanningDevices = true;

    const devicesBefore = this.devices;
    const constraints = {
      video: this.options.video,
      audio: this.options.audio,
    };
    getDevices(constraints).then((devices) => {
      let newDevice = null;
      let useNewDevice = false;
      if (this.status === 'initiating' || this.status === 'previewing' || this.status === 'denied') {
        useNewDevice = this.options.chooseNewDevice;
      }
      if (useNewDevice) {
        for (let device of devices) {
          const added = !devicesBefore.find((deviceBefore) => {
            return (deviceBefore.id === device.id);
          });
          if (added) {
            newDevice = device;
            break;
          }
        }
      }
      this.devices = devices;
      this.scanningDevices = false;
      if (newDevice) {
        // use the new device
        this.choose(newDevice.id);
      } else {
        // just note the change to the device list
        this.notifyChange();
      }
    });
  }

  /**
   * Called when the media stream ends unexpectedly (e.g. unplugging a USB camera)
   *
   * @param  {Event} evt
   */
  handleStreamEnd(evt) {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      if (tracks.indexOf(evt.target) !== -1) {
        if (this.status === 'previewing') {
          this.reacquire();
        } else if (this.status === 'capturing' || this.status === 'paused') {
          this.releaseInput();
          this.stop();
        }
      }
    }
  }

  /**
   * Called when the audio processor has data to be processed
   *
   * @param  {Event} evt
   */
  handleAudioProcess(evt) {
    const samples = evt.inputBuffer.getChannelData(0);
    const count = samples.length;
    let max = 0;
    for (let i = 0; i < count; i++) {
      const s = samples[i];
      if (s > max) {
        max = s;
      }
    }
    const volume = Math.round(max * 100);
    if (volume !== this.volume) {
      this.volume = volume;
      this.notifyChange();
    }
  }

  /**
   * Called when the media recorder has finished encoding some video/audio
   *
   * @param  {Event} evt
   */
  handleMediaRecorderData(evt) {
    const blob = evt.data;
    this.mediaRecorderBlobs.push(blob);
    if (this.options.segmentDuration) {
      this.triggerEvent(new MediaCaptureEvent('chunk', this, { blob }));
    }
  }

  /**
   * Called when the media recorder starts
   *
   * @param  {Event} evt
   */
  handleMediaRecorderStart(evt) {
    this.mediaRecorderInterval = setInterval(this.handleMediaRecorderInterval, 100);
    this.mediaRecorderStartTime = new Date;
    this.status = 'capturing';
    this.notifyChange();
  }

  /**
   * Called when the media recorder stops
   *
   * @param  {Event} evt
   */
  handleMediaRecorderStop(evt) {
    clearInterval(this.mediaRecorderInterval);
    const blobs = this.mediaRecorderBlobs;
    if (blobs.length > 0) {
      const { duration } = this;
      let blob;
      if (blobs.length === 1) {
        blob = blobs[0];
      } else {
        blob = new Blob(blobs, { type: blobs[0].type });
      }
      const url = URL.createObjectURL(blob);
      if (this.videoDimensions) {
        const { width, height } = this.videoDimensions;
        this.capturedVideo = { url, blob, blobs, duration, width, height };
      } else {
        this.capturedAudio = { url, blob, blobs, duration };
      }
      if (this.mediaRecorderStartTime) {
        const now = new Date;
        const elapsed = now - this.mediaRecorderStartTime;
        this.duration = this.mediaRecorderDuration + elapsed;
      }
      this.status = 'captured';
    } else {
      this.duration = undefined;
      this.status = 'previewing';
    }
    this.mediaRecorder = null;
    this.mediaRecorderBlobs = [];
    this.mediaRecorderInterval = 0;
    this.mediaRecorderStartTime = null;
    this.mediaRecorderDuration = 0;
    this.notifyChange();
    if (this.options.segmentDuration) {
      this.triggerEvent(new MediaCaptureEvent('end', this));
    }
  }

  /**
   * Called when the media recorder pauses
   *
   * @param  {Event} evt
   */
  handleMediaRecorderPause(evt) {
    clearInterval(this.mediaRecorderInterval);

    const now = new Date;
    const elapsed = now - this.mediaRecorderStartTime;
    this.duration = this.mediaRecorderDuration + elapsed;
    this.mediaRecorderDuration = this.duration;
    this.mediaRecorderStartTime = null;
    this.status = 'paused';
    this.notifyChange();
  }

  /**
   * Called when the media recorder resumes recording
   *
   * @param  {Event} evt
   */
  handleMediaRecorderResume(evt) {
    this.handleMediaRecorderStart(evt);
  }

  /**
   * Called when the viewing device's orientation has changed
   *
   * @param  {Event} evt
   */
  handleOrientationChange(evt) {
    // recalculate the video width and height when we receive the resize event
    // so that dimensions from the DOM would reflect the new orientation
    this.orientationChanged = true;
  }

  /**
   * Called when the HTML document has been resized
   *
   * @param  {Event} evt
   */
  handleResize(evt) {
    if (this.orientationChanged) {
      this.orientationChanged = false;

      const video = this.liveVideo;
      if (video) {
        const { stream } = video;
        getVideoStreamMeta(stream).then((meta) => {
          const { width, height } = media;
          if (video.width !== width || video.height !== height) {
            this.liveVideo = { stream, width, height };
            this.notifyChange();
          }
        });
      }
    }
  }

  handleMediaRecorderInterval() {
    const now = new Date;
    const elapsed = now - this.mediaRecorderStartTime;
    this.duration = this.mediaRecorderDuration + elapsed;
    this.notifyChange();
  }
}

/**
 * Ask the browser for a media stream that
 *
 * @param  {Object} constraints
 *
 * @return {Promise<MediaStream>}
 */
function getMediaStream(constraints) {
  try {
    return navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Obtain the dimension of a video stream
 *
 * @param  {MediaStream} stream
 *
 * @return {Promise<Object>}
 */
function getVideoStreamMeta(stream) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('VIDEO');
    el.srcObject = stream;
    el.muted = true;
    // dimensions aren't always available when loadedmetadata fires
    // listening for additional event just in case
    el.onloadedmetadata =
    el.onloadeddata =
    el.oncanplay = (evt) => {
      if (resolve) {
        let meta;
        if (el.tagName === 'VIDEO') {
          const { videoWidth, videoHeight } = el;
          if (videoWidth && videoHeight) {
            meta = { width: videoWidth, height: videoHeight };
          }
        } else {
          meta = {};
        }
        if (meta) {
          resolve(meta);
          resolve = null;
          el.pause();
          el.srcObject = null;
        }
      }
    };
    el.onerror = (evt) => {
      reject(new MediaCaptureError('Unable to obtain metadata'));
      el.pause();
    };
    el.play();
  });
}

/**
 * Obtain a snapshot of a video stream
 *
 * @param  {MediaStream} stream
 *
 * @return {Promise<HTMLCanvasElement>}
 */
function getVideoStreamSnapshot(stream) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('VIDEO');
    el.srcObject = stream;
    el.muted = true;
    el.oncanplay = (evt) => {
      if (resolve) {
        const { videoWidth, videoHeight } = el;
        const canvas = document.createElement('CANVAS');
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(el, 0, 0, videoWidth, videoHeight);
        resolve(canvas);
        resolve = null;
        el.pause();
        el.srcObject = null;
      }
    };
    el.onerror = (evt) => {
      reject(new MediaCaptureError('Unable to capture image'));
      el.pause();
      el.srcObject = null;
    };
    el.play();
  });
}

/**
 * Stop all tracks of a media stream
 *
 * @param  {MediaStream} stream
 */
function stopMediaStream(stream) {
  // stop all tracks
  const tracks = stream.getTracks();
  for (let track of tracks) {
    track.stop();
  }
}

/**
 * Get list of devices for the given constraints, asking for permission if
 * necessary
 *
 * @param  {Object} constraints
 *
 * @return {Promise<Array<Object>>}
 */
function getDevices(constraints) {
  let kind;
  if (constraints.video) {
    kind = 'videoinput';
  } else if (constraints.audio) {
    kind = 'audioinput';
  }
  return enumerateDevices(kind).then((devices) => {
    // we can't get the labels without obtaining permission first
    let labelless = 0;
    for (let device of devices) {
      if (device.label) {
        labelless++;
      }
    }
    if (labelless > 0 && labelless === devices.length) {
      // trigger request for permission
      return getMediaStream(constraints).then((stream) => {
        stopMediaStream(stream);
        return enumerateDevices(kind);
      });
    } else {
      return devices;
    }
  }).then((devices) => {
    return devices.map((device) => {
      return {
        id: device.deviceId,
        label: device.label || '',
      };
    });
  });
}

/**
 * Enumerate a particular kind of devices
 *
 * @param  {Object} contraints
 *
 * @return {Promise<Array<Object>>}
 */
function enumerateDevices(kind) {
  const mediaDevices = navigator.mediaDevices;
  if (mediaDevices && mediaDevices.enumerateDevices) {
    return mediaDevices.enumerateDevices().then((devices) => {
      return devices.filter(device => device.kind === kind);
    }).catch((err) => {
      return [];
    });
  } else {
    return Promise.resolve([]);
  }
}

/**
 * Choose a device from the given list, based on id or description
 *
 * @param  {Array<Object>} devices
 * @param  {String} preferred
 *
 * @return {Object}
 */
function chooseDevice(devices, preferred) {
  if (preferred) {
    for (let device of devices) {
      if (device.id === preferred) {
        return device;
      }
    }
    const fragment = preferred.toLowerCase();
    for (let device of devices) {
      const label = device.label.toLowerCase();
      if (label.indexOf(fragment) !== -1) {
        return device;
      }
    }
  }
  return devices[0];
}

/**
 * Save canvas contents to a blob using toBlob() if browser supports it,
 * otherwise fallback to toDataURL()
 *
 * @param  {HTMLCanvasElement} canvas
 * @param  {String} mimeType
 * @param  {Number} quality
 *
 * @return {Promise<Blob>}
 */
function saveCanvasContents(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    if (typeof(canvas.toBlob) === 'function') {
      canvas.toBlob(resolve, mimeType, 90);
    } else {
      try {
        const dataURL = canvas.toDataURL(mimeType, quality);
        const xhr = new XMLHttpRequest;
        xhr.responseType = 'blob';
        xhr.onload = function(evt) {
          if (xhr.status >= 400) {
            reject(new MediaCaptureError('Error parsing data URL'));
          } else {
            resolve(xhr.response);
          }
        };
        xhr.onerror = function() {
          reject(new MediaCaptureError('Unable to load image'));
        };
        xhr.open('GET', dataURL, true);
        xhr.send();
      } catch (err) {
        reject(err);
      }
    }
  });
}

export {
  RelaksMediaCapture,
  RelaksMediaCapture as MediaCapture,
};
