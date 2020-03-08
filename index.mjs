import { GenericEvent, EventEmitter } from 'relaks-event-emitter';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var RelaksMediaCaptureError = /*#__PURE__*/function (_Error) {
  _inherits(RelaksMediaCaptureError, _Error);

  function RelaksMediaCaptureError() {
    _classCallCheck(this, RelaksMediaCaptureError);

    return _possibleConstructorReturn(this, _getPrototypeOf(RelaksMediaCaptureError).apply(this, arguments));
  }

  return RelaksMediaCaptureError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var RelaksMediaCaptureEvent = /*#__PURE__*/function (_GenericEvent) {
  _inherits(RelaksMediaCaptureEvent, _GenericEvent);

  function RelaksMediaCaptureEvent() {
    _classCallCheck(this, RelaksMediaCaptureEvent);

    return _possibleConstructorReturn(this, _getPrototypeOf(RelaksMediaCaptureEvent).apply(this, arguments));
  }

  return RelaksMediaCaptureEvent;
}(GenericEvent);

var defaultOptions = {
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
  silent: false
};

var RelaksMediaCapture = /*#__PURE__*/function (_EventEmitter) {
  _inherits(RelaksMediaCapture, _EventEmitter);

  function RelaksMediaCapture(options) {
    var _this;

    _classCallCheck(this, RelaksMediaCapture);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RelaksMediaCapture).call(this));
    _this.options = {};
    _this.status = undefined;
    _this.duration = undefined;
    _this.volume = undefined;
    _this.liveVideo = undefined;
    _this.liveAudio = undefined;
    _this.capturedVideo = undefined;
    _this.capturedAudio = undefined;
    _this.capturedImage = undefined;
    _this.lastError = null;
    _this.devices = [];
    _this.chosenDeviceID = undefined;
    _this.stream = undefined;
    _this.audioProcessor = undefined;
    _this.audioContext = undefined;
    _this.audioSource = undefined;
    _this.mediaRecorder = null;
    _this.mediaRecorderStartTime = null;
    _this.mediaRecorderDuration = 0;
    _this.mediaRecorderInterval = 0;
    _this.mediaRecorderBlobs = [];
    _this.orientationChanged = false;
    _this.videoDimensions = null;
    _this.handleDeviceChange = _this.handleDeviceChange.bind(_assertThisInitialized(_this));
    _this.handleStreamEnd = _this.handleStreamEnd.bind(_assertThisInitialized(_this));
    _this.handleAudioProcess = _this.handleAudioProcess.bind(_assertThisInitialized(_this));
    _this.handleMediaRecorderData = _this.handleMediaRecorderData.bind(_assertThisInitialized(_this));
    _this.handleMediaRecorderStart = _this.handleMediaRecorderStart.bind(_assertThisInitialized(_this));
    _this.handleMediaRecorderStop = _this.handleMediaRecorderStop.bind(_assertThisInitialized(_this));
    _this.handleMediaRecorderPause = _this.handleMediaRecorderPause.bind(_assertThisInitialized(_this));
    _this.handleMediaRecorderResume = _this.handleMediaRecorderResume.bind(_assertThisInitialized(_this));
    _this.handleMediaRecorderInterval = _this.handleMediaRecorderInterval.bind(_assertThisInitialized(_this));
    _this.handleOrientationChange = _this.handleOrientationChange.bind(_assertThisInitialized(_this));
    _this.handleResize = _this.handleResize.bind(_assertThisInitialized(_this));

    for (var name in defaultOptions) {
      if (options && options[name] !== undefined) {
        _this.options[name] = options[name];
      } else {
        _this.options[name] = defaultOptions[name];
      }
    }

    return _this;
  }
  /**
   * Begin the capturing process, first by acquiring a recording device.
   * Capturing won't start until start() is called
   */


  _createClass(RelaksMediaCapture, [{
    key: "activate",
    value: function activate() {
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

  }, {
    key: "deactivate",
    value: function deactivate() {
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
          this.mediaRecorderDuration = 0;
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

  }, {
    key: "acquire",
    value: function acquire() {
      var _this2 = this;

      if (!this.status) {
        this.status = 'acquiring';
      }

      var constraints = {
        video: this.options.video,
        audio: this.options.audio
      };
      return getDevices(constraints).then(function (devices) {
        var preferred = _this2.chosenDeviceID || _this2.options.preferredDevice;
        var device = chooseDevice(devices, preferred);

        if (device) {
          var criteria = {
            deviceId: device.id
          };

          if (constraints.video) {
            constraints.video = criteria;
          } else if (constraints.audio) {
            constraints.audio = criteria;
          }
        }

        return getMediaStream(constraints).then(function (stream) {
          // stop all tracks
          _this2.status = 'initiating';
          _this2.devices = devices;
          _this2.chosenDeviceID = device ? device.id : undefined;

          _this2.notifyChange();

          if (constraints.video) {
            return getVideoStreamMeta(stream).then(function (meta) {
              var width = meta.width,
                  height = meta.height;
              _this2.stream = stream;
              _this2.liveVideo = {
                stream: stream,
                height: height,
                width: width
              };

              if (_this2.options.watchVolume && constraints.audio) {
                _this2.watchAudioVolume();
              }

              _this2.watchStreamStatus();

              _this2.status = 'previewing';

              _this2.notifyChange();
            });
          } else if (constraints.audio) {
            _this2.stream = stream;
            _this2.liveAudio = {
              stream: stream
            };

            if (_this2.options.watchVolume) {
              _this2.watchAudioVolume();
            }

            _this2.watchStreamStatus();

            _this2.status = 'previewing';

            _this2.notifyChange();
          }
        });
      })["catch"](function (err) {
        _this2.status = 'denied';

        _this2.saveError(err);

        _this2.notifyChange();

        return null;
      });
    }
    /**
     * Start capturing video/audio
     */

  }, {
    key: "start",
    value: function start() {
      try {
        if (this.mediaRecorder) {
          return;
        }

        var options = {};

        if (this.options.audio) {
          options.audioBitsPerSecond = this.options.audioBitsPerSecond;
          options.mimeType = this.options.audioMIMEType;
        }

        if (this.options.video) {
          options.videoBitsPerSecond = this.options.videoBitsPerSecond, options.mimeType = this.options.videoMIMEType;
        }

        if (this.liveVideo) {
          this.videoDimensions = {
            width: this.liveVideo.width,
            height: this.liveVideo.height
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

  }, {
    key: "stop",
    value: function stop() {
      try {
        this.mediaRecorder.stop();
      } catch (err) {
        this.saveError(err);
      }
    }
    /**
     * Pause recording
     */

  }, {
    key: "pause",
    value: function pause() {
      try {
        this.mediaRecorder.pause();
      } catch (err) {
        this.saveError(err);
      }
    }
    /**
     * Resume recording
     */

  }, {
    key: "resume",
    value: function resume() {
      try {
        this.mediaRecorder.resume();
      } catch (err) {
        this.saveError(err);
      }
    }
    /**
     * Capture a snapshot of the video input
     */

  }, {
    key: "snap",
    value: function snap() {
      var _this3 = this;

      try {
        var mimeType = this.options.imageMIMEType;
        var quality = this.options.imageQuality || 90;
        var imageOnly = this.options.captureImageOnly;

        if (!this.liveVideo) {
          throw new RelaksMediaCaptureError('No video stream');
        }

        getVideoStreamSnapshot(this.stream).then(function (canvas) {
          return saveCanvasContents(canvas, mimeType, quality).then(function (blob) {
            var width = canvas.width,
                height = canvas.height;
            var url = URL.createObjectURL(blob);
            _this3.capturedImage = {
              url: url,
              blob: blob,
              width: width,
              height: height
            };

            if (imageOnly) {
              _this3.status = 'captured';
            }

            _this3.notifyChange();
          });
        });
      } catch (err) {
        this.saveError(err);
      }
    }
    /**
     * Keep an eye out for device addition/removal
     */

  }, {
    key: "watchDevices",
    value: function watchDevices() {
      var _navigator = navigator,
          mediaDevices = _navigator.mediaDevices;

      if (mediaDevices && mediaDevices.addEventListener) {
        mediaDevices.addEventListener('devicechange', this.handleDeviceChange);
      }

      window.addEventListener('orientationchange', this.handleOrientationChange);
      window.addEventListener('resize', this.handleResize);
    }
  }, {
    key: "unwatchDevices",
    value: function unwatchDevices() {
      var _navigator2 = navigator,
          mediaDevices = _navigator2.mediaDevices;

      if (mediaDevices && mediaDevices.removeEventListener) {
        mediaDevices.removeEventListener('devicechange', this.handleDeviceChange);
      }

      window.removeEventListener('orientationchange', this.handleOrientationChange);
      window.removeEventListener('resize', this.handleResize);
    }
    /**
     * Keep an eye on the input stream
     */

  }, {
    key: "watchStreamStatus",
    value: function watchStreamStatus() {
      var tracks = this.stream.getTracks();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = tracks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var track = _step.value;
          track.onended = this.handleStreamEnd;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    /**
     * Remove event handlers from the input stream
     */

  }, {
    key: "unwatchStreamStatus",
    value: function unwatchStreamStatus() {
      var tracks = this.stream.getTracks();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = tracks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var track = _step2.value;
          track.onended = null;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    /**
     * Keep an eye on the audio volume
     */

  }, {
    key: "watchAudioVolume",
    value: function watchAudioVolume() {
      if (typeof AudioContext === 'function') {
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

  }, {
    key: "unwatchAudioVolume",
    value: function unwatchAudioVolume() {
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

  }, {
    key: "releaseInput",
    value: function releaseInput() {
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

  }, {
    key: "revokeBlobURLs",
    value: function revokeBlobURLs() {
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

  }, {
    key: "reacquire",
    value: function reacquire() {
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

  }, {
    key: "choose",
    value: function choose(deviceID) {
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

  }, {
    key: "clear",
    value: function clear() {
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
     * Fulfill promise returned by change() and emit a change event
     */

  }, {
    key: "notifyChange",
    value: function notifyChange() {
      this.triggerEvent(new RelaksMediaCaptureEvent('change', this));
    }
    /**
     * Save the last error, dumping it into the console optionally
     *
     * @param {[type]} err
     */

  }, {
    key: "saveError",
    value: function saveError(err) {
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

  }, {
    key: "handleDeviceChange",
    value: function handleDeviceChange(evt) {
      var _this4 = this;

      if (this.scanningDevices) {
        return;
      }

      this.scanningDevices = true;
      var devicesBefore = this.devices;
      var constraints = {
        video: this.options.video,
        audio: this.options.audio
      };
      getDevices(constraints).then(function (devices) {
        var newDevice = null;
        var useNewDevice = false;

        if (_this4.status === 'initiating' || _this4.status === 'previewing' || _this4.status === 'denied') {
          useNewDevice = _this4.options.chooseNewDevice;
        }

        if (useNewDevice) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            var _loop = function _loop() {
              var device = _step3.value;
              var added = !devicesBefore.find(function (deviceBefore) {
                return deviceBefore.id === device.id;
              });

              if (added) {
                newDevice = device;
                return "break";
              }
            };

            for (var _iterator3 = devices[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _ret = _loop();

              if (_ret === "break") break;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }

        _this4.devices = devices;
        _this4.scanningDevices = false;

        if (newDevice) {
          // use the new device
          _this4.choose(newDevice.id);
        } else {
          // just note the change to the device list
          _this4.notifyChange();
        }
      });
    }
    /**
     * Called when the media stream ends unexpectedly (e.g. unplugging a USB camera)
     *
     * @param  {Event} evt
     */

  }, {
    key: "handleStreamEnd",
    value: function handleStreamEnd(evt) {
      if (this.stream) {
        var tracks = this.stream.getTracks();

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

  }, {
    key: "handleAudioProcess",
    value: function handleAudioProcess(evt) {
      var samples = evt.inputBuffer.getChannelData(0);
      var count = samples.length;
      var max = 0;

      for (var i = 0; i < count; i++) {
        var s = samples[i];

        if (s > max) {
          max = s;
        }
      }

      var volume = Math.round(max * 100);

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

  }, {
    key: "handleMediaRecorderData",
    value: function handleMediaRecorderData(evt) {
      var blob = evt.data;
      this.mediaRecorderBlobs.push(blob);

      if (this.options.segmentDuration) {
        this.triggerEvent(new RelaksMediaCaptureEvent('chunk', this, {
          blob: blob
        }));
      }
    }
    /**
     * Called when the media recorder starts
     *
     * @param  {Event} evt
     */

  }, {
    key: "handleMediaRecorderStart",
    value: function handleMediaRecorderStart(evt) {
      this.mediaRecorderInterval = setInterval(this.handleMediaRecorderInterval, 100);
      this.mediaRecorderStartTime = new Date();
      this.status = 'capturing';
      this.notifyChange();
    }
    /**
     * Called when the media recorder stops
     *
     * @param  {Event} evt
     */

  }, {
    key: "handleMediaRecorderStop",
    value: function handleMediaRecorderStop(evt) {
      clearInterval(this.mediaRecorderInterval);
      var blobs = this.mediaRecorderBlobs;

      if (blobs.length > 0) {
        var duration = this.duration;
        var blob;

        if (blobs.length === 1) {
          blob = blobs[0];
        } else {
          blob = new Blob(blobs, {
            type: blobs[0].type
          });
        }

        var url = URL.createObjectURL(blob);

        if (this.videoDimensions) {
          var _this$videoDimensions = this.videoDimensions,
              width = _this$videoDimensions.width,
              height = _this$videoDimensions.height;
          this.capturedVideo = {
            url: url,
            blob: blob,
            blobs: blobs,
            duration: duration,
            width: width,
            height: height
          };
        } else {
          this.capturedAudio = {
            url: url,
            blob: blob,
            blobs: blobs,
            duration: duration
          };
        }

        if (this.mediaRecorderStartTime) {
          var now = new Date();
          var elapsed = now - this.mediaRecorderStartTime;
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
        this.triggerEvent(new RelaksMediaCaptureEvent('end', this));
      }
    }
    /**
     * Called when the media recorder pauses
     *
     * @param  {Event} evt
     */

  }, {
    key: "handleMediaRecorderPause",
    value: function handleMediaRecorderPause(evt) {
      clearInterval(this.mediaRecorderInterval);
      var now = new Date();
      var elapsed = now - this.mediaRecorderStartTime;
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

  }, {
    key: "handleMediaRecorderResume",
    value: function handleMediaRecorderResume(evt) {
      this.handleMediaRecorderStart(evt);
    }
    /**
     * Called when the viewing device's orientation has changed
     *
     * @param  {Event} evt
     */

  }, {
    key: "handleOrientationChange",
    value: function handleOrientationChange(evt) {
      // recalculate the video width and height when we receive the resize event
      // so that dimensions from the DOM would reflect the new orientation
      this.orientationChanged = true;
    }
    /**
     * Called when the HTML document has been resized
     *
     * @param  {Event} evt
     */

  }, {
    key: "handleResize",
    value: function handleResize(evt) {
      var _this5 = this;

      if (this.orientationChanged) {
        this.orientationChanged = false;
        var video = this.liveVideo;

        if (video) {
          var stream = video.stream;
          getVideoStreamMeta(stream).then(function (meta) {
            var _media = media,
                width = _media.width,
                height = _media.height;

            if (video.width !== width || video.height !== height) {
              _this5.liveVideo = {
                stream: stream,
                width: width,
                height: height
              };

              _this5.notifyChange();
            }
          });
        }
      }
    }
  }, {
    key: "handleMediaRecorderInterval",
    value: function handleMediaRecorderInterval() {
      var now = new Date();
      var elapsed = now - this.mediaRecorderStartTime;
      this.duration = this.mediaRecorderDuration + elapsed;
      this.notifyChange();
    }
  }]);

  return RelaksMediaCapture;
}(EventEmitter);
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
  return new Promise(function (resolve, reject) {
    var el = document.createElement('VIDEO');
    el.srcObject = stream;
    el.muted = true; // dimensions aren't always available when loadedmetadata fires
    // listening for additional event just in case

    el.onloadedmetadata = el.onloadeddata = el.oncanplay = function (evt) {
      if (resolve) {
        var meta;

        if (el.tagName === 'VIDEO') {
          var videoWidth = el.videoWidth,
              videoHeight = el.videoHeight;

          if (videoWidth && videoHeight) {
            meta = {
              width: videoWidth,
              height: videoHeight
            };
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

    el.onerror = function (evt) {
      reject(new RelaksMediaCaptureError('Unable to obtain metadata'));
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
  return new Promise(function (resolve, reject) {
    var el = document.createElement('VIDEO');
    el.srcObject = stream;
    el.muted = true;

    el.oncanplay = function (evt) {
      if (resolve) {
        var videoWidth = el.videoWidth,
            videoHeight = el.videoHeight;
        var canvas = document.createElement('CANVAS');
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        var context = canvas.getContext('2d');
        context.drawImage(el, 0, 0, videoWidth, videoHeight);
        resolve(canvas);
        resolve = null;
        el.pause();
        el.srcObject = null;
      }
    };

    el.onerror = function (evt) {
      reject(new RelaksMediaCaptureError('Unable to capture image'));
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
  var tracks = stream.getTracks();
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = tracks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var track = _step4.value;
      track.stop();
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
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
  var kind;

  if (constraints.video) {
    kind = 'videoinput';
  } else if (constraints.audio) {
    kind = 'audioinput';
  }

  return enumerateDevices(kind).then(function (devices) {
    // we can't get the labels without obtaining permission first
    var labelless = 0;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = devices[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var device = _step5.value;

        if (device.label) {
          labelless++;
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
          _iterator5["return"]();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    if (labelless > 0 && labelless === devices.length) {
      // trigger request for permission
      return getMediaStream(constraints).then(function (stream) {
        stopMediaStream(stream);
        return enumerateDevices(kind);
      });
    } else {
      return devices;
    }
  }).then(function (devices) {
    return devices.map(function (device) {
      return {
        id: device.deviceId,
        label: device.label || ''
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
  var mediaDevices = navigator.mediaDevices;

  if (mediaDevices && mediaDevices.enumerateDevices) {
    return mediaDevices.enumerateDevices().then(function (devices) {
      return devices.filter(function (device) {
        return device.kind === kind;
      });
    })["catch"](function (err) {
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
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = devices[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var device = _step6.value;

        if (device.id === preferred) {
          return device;
        }
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
          _iterator6["return"]();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    var fragment = preferred.toLowerCase();
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = devices[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var _device = _step7.value;

        var label = _device.label.toLowerCase();

        if (label.indexOf(fragment) !== -1) {
          return _device;
        }
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
          _iterator7["return"]();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
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
  return new Promise(function (resolve, reject) {
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob(resolve, mimeType, 90);
    } else {
      try {
        var dataURL = canvas.toDataURL(mimeType, quality);
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onload = function (evt) {
          if (xhr.status >= 400) {
            reject(new RelaksMediaCaptureError('Error parsing data URL'));
          } else {
            resolve(xhr.response);
          }
        };

        xhr.onerror = function () {
          reject(new RelaksMediaCaptureError('Unable to load image'));
        };

        xhr.open('GET', dataURL, true);
        xhr.send();
      } catch (err) {
        reject(err);
      }
    }
  });
}

export default RelaksMediaCapture;
export { RelaksMediaCapture as MediaCapture, RelaksMediaCaptureError as MediaCaptureError, RelaksMediaCaptureEvent as MediaCaptureEvent, RelaksMediaCapture, RelaksMediaCaptureError, RelaksMediaCaptureEvent };
