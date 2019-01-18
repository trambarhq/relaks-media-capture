Relaks Media Capture
====================

A reusable library for capturing video, audio, and images in a web browser. Designed to be used with [Relaks](https://github.com/trambarhq/relaks).

* [Installation](#installation)
* [Usage](#usage)
* [Options](#options)
* [Properties](#properties)
* [Methods](#methods)
* [Events](#events)
* [Examples](#examples)

## Installation

```sh
npm --save-dev install relaks-media-capture
```

## Usage

```javascript
import RelaksMediaCapture from 'relaks-media-capture';

class VideoDialogBox extends AsyncComponent {
    constructor(props) {
        super(props);
        let options = {
            video: true,
            audio: true,
            watchVolume: true,
        };
        this.capture = new RelaksMediaCapture(options);
    }

    async renderAsync(meanwhile) {
        meanwhile.delay(50, 50);
        let props = {
            onStart: this.handleStart,
            onStop: this.handleStop,
            onPause: this.handlePause,
            onResume: this.handleResume,
            onClear: this.handleClear,
            onChoose: this.handleChoose,
            onAccept: this.handleAccept,
            onCancel: this.handleCancel,
        };
        this.capture.activate();
        do {
            props.status = this.capture.status;
            props.devices = this.capture.devices;
            props.selectedDeviceID = this.capture.selectedDeviceID;
            props.liveVideo = this.capture.liveVideo;
            props.duration = this.capture.duration;
            props.volume = this.capture.volume;
            props.capturedImage = this.capture.capturedImage;
            props.capturedVideo = this.capture.capturedVideo;
            meanwhile.show(<VideoDialogBoxSync {...props} />);
            await this.capture.change();
        } while (this.capture.active);
        return <VideoDialogBoxSync {...props} />;
    }
}
```

## Options

* [audio](#audio)
* [audioBitsPerSecond](#audiobitspersecond)
* [audioMIMEType](#audiomimetype)
* [captureImageOnly](#captureimageonly)
* [chooseNewDevice](#choosenewdevice)
* [deactivationDelay](#deactivationdelay)
* [imageMIMEType](#imagemimetype)
* [preferredDevice](#preferreddevice)
* [segmentDuration](#segmentduration)
* [video](#video)
* [videoBitsPerSecond](#videobitspersecond)
* [videoMIMEType](#videomimetype)
* [watchVolume](#watchvolume)

### audio

A boolean indicating whether audio is desired.

Default value: `true`.

### audioBitsPerSecond

The desired audio bitrate.

Default value: `128000`

### audioMIMEType

The desired audio type. Due to licensing cost, it's unlikely that anything other than the open source [WebM](https://www.webmproject.org/) would be available.

Default value: `"audio/webm"`

### captureImageOnly

Whether the desired result is an image rather than a video. When it's set, calling [`snap()`](#snap) will change the status to `"captured"`.

Default value: `false`

### chooseNewDevice

Whether a new device should be automatically chosen as the input.

Default value: `true`

### imageMIMEType

The desired audio type.

Default value: `"image/jpeg"`

### preferredDevice

A text string indicating the preferred input device. If the device label contains the text, it'll be selected.

Default value: `"front"`

### segmentDuration

Duration of a video segment, in millisecond, that the `MediaRecorder` should yield as soon as that amount of data becomes available. This allows a video to be uploaded in chunks as it's being recorded.

When it's set, the media capture object will emit the [`chunk`](#chunk) event periodically. It'll emit the [`end`](#end) event when capturing ends.

Default value: `undefined`

### video

A boolean indicating whether video is desired.

Default value: `true`

### videoBitsPerSecond

The desired video bitrate.

Default value: `2500000`

### videoMIMEType

The desired video type. Due to licensing cost, it's unlikely that anything other than the open source [WebM](https://www.webmproject.org/) would be available.

Default value: `"video/webm"`

### watchVolume

A boolean indicating whether audio volume should be monitored.

Default value: `false`

## Properties

* [active](#active)
* [capturedImage](#capturedimage)
* [capturedAudio](#capturedaudio)
* [capturedVideo](#capturedvideo)
* [duration](#duration)
* [lastError](#error)
* [liveAudio](#liveaudio)
* [liveVideo](#livevideo)
* [devices](#devices)
* [selectedDeviceID](#selecteddeviceid)
* [status](#status)
* [volume](#volume)

### active

A boolean indicating whether the media capture object is active.

### capturedImage

An object holding properties of the captured image, with the following properties:

* `blob` - blob containing the image data
* `url` - URL to the blob
* `width` - Width of the image
* `height` - height of the image

The URL will be revoked when `deactivate()` is called. It should only be used while the media capture object is active.

### capturedAudio

An object holding properties of the captured audio, with the following properties:

* `blob` - blob containing the audio data
* `url` - URL to the blob

The URL will be revoked when `deactivate()` is called. It should only be used while the media capture object is active.

### capturedVideo

* `blob` - blob containing the video data
* `url` - URL to the blob
* `width` - width of the image
* `height` - height of the image

The URL will be revoked when `deactivate()` is called. It should only be used while the media capture object is active.

### duration

Duration of the captured video/audio, in millisecond. `undefined` initially.

### lastError

The last error encountered.

### liveAudio

An object representing the input from the microphone, with the following properties:

* `stream` - an instance of `MediaStream`

It's only available when [`audio`](#audio) is `true` and [`video`](#video) is `false`.

### liveVideo

An object representing the input from the camera, with the following properties:

* `stream` - an instance of `MediaStream`
* `height` - the height of the video
* `width` - the width of the video

It's available when [`video`](#video) is `true`.

`height` and `width` will swap when the user rotates a phone or tablet.

### devices

An array containing objects describing available input devices, each with the following properties:

* `id` - the device's ID (a string)
* `label` - the device's name

### selectedDeviceID

ID of the currently selected camera.

### status

One of the following:

* "acquiring" - in the process of acquiring a camera
* "denied" - permission to use camera was denied
* "initiating" - permission has been granted and the camera is about to become available
* "previewing" - camera input is available
* "capturing" - video/audio capturing is happening
* "paused" - Video/audio capturing has been paused
* "captured" - a video, audio, or image has been captured

### volume

A number between 0 and 100 indicating the strength of audio coming from the microphone.

It's present only when [`watchVolume`](#watchvolume) is `true`.

## Methods

**Event listeners:**

* [addEventListener()](#addeventlistener)
* [removeEventListener()](#removeeventlistener)
* [waitForEvent()](#waitforevent)

**Activation**

* [activate()](#activate)
* [deactivate()](#deactivate)

**Video/audio capture:**

* [pause()](#pause)
* [resume()](#resume)
* [start()](#start)
* [stop()](#stop)

**Image capture:**

* [snap()](#snap)

**Others:**

* [change()](#change)
* [choose()](#choose)
* [clear()](#clear)

### addEventListener()

```typescript
function addEventListener(type: string, handler: function, beginning?:boolean): void
```

Add an event listener to the route manager. `handler` will be called whenever events of `type` occur. When `beginning` is true, the listener will be place before any existing listeners. Otherwise it's added at the end of the list.

Inherited from [relaks-event-emitter](https://github.com/trambarhq/relaks-event-emitter).

### removeEventListener()

```typescript
function removeEventListener(type: string, handler: function): void
```

Remove an event listener from the route manager. `handler` and `type` must match what was given to `addEventListener()`.

Inherited from [relaks-event-emitter](https://github.com/trambarhq/relaks-event-emitter).

### waitForEvent()

```typescript
async function waitForEvent(type: string): Event
```

Return a promise that is fulfilled when an event of the specified type occurs.

Inherited from [relaks-event-emitter](https://github.com/trambarhq/relaks-event-emitter).

### activate()

```typescript
function activate(): void
```

Activate the media capture object.

### deactivate()

```typescript
function deactivate(): void
```

Deactivate the media capture object.

### pause()

```typescript
function pause(): void
```

Pause capturing. [`status`](#status) will change to `"pause"`.

### resume()

```typescript
function resume(): void
```

Resume capturing. [`status`](#status) will become `"capturing"` again.

### start()

```typescript
function start(): void
```

Start capturing video and/or audio. [`status`](#status) will change to `"capturing"`.

### stop()

```typescript
function stop(): void
```

Stop capturing. [`status`](#status) will change to `"captured"` soon afterward.

### snap()

```typescript
function snap(): void
```

Take a snapshot of the camera input. The result will be stored in [`capturedImage`](#captureimage).

[`status`](#status) will become `"captured"` afterward if [`captureImageOnly`](#captureimageonly) is `true`.

### change()

```typescript
async function change(): Event
```

Wait for a [`change`](#change-1) event to occur.

### choose()

```typescript
async function choose(id: String): void
```

Choose the camera or mic with the specified ID as the recording device.

### clear()

```typescript
function clear(): void
```

Clear [`capturedVideo`](#capturedvideo), [`capturedAudio`](#capturedaudio), and [`capturedImage`](#capturedimage). Return to previewing.

## Events

* [change](#change-1)
* [chunk](#chunk)
* [end](#end)

### change

The `change` event is emitted after a property of media capture object has changed.

**Properties:**

* `propagationStopped` - whether `stopImmediatePropagation()` was called
* `target` - media capture object
* `type` - `"change"`

**Methods:**

* `stopImmediatePropagation()` - stop other listeners from receiving the event

### chunk

The `chunk` event is emitted when a chunk of data become available. Only occurs when [segmentDuration](#segmentduration) is set.

**Properties:**

* `blob` - a `Blob` containing data of a video/audio segment
* `propagationStopped` - whether `stopImmediatePropagation()` was called
* `target` - media capture object
* `type` - `"change"`

**Methods:**

* `stopImmediatePropagation()` - stop other listeners from receiving the event

### end

The `end` event is emitted when video recording has come to an end, after the final `chunk` event. Only occurs when [segmentDuration](#segmentduration) is set.

**Properties:**

* `propagationStopped` - whether `stopImmediatePropagation()` was called
* `target` - media capture object
* `type` - `"change"`

**Methods:**

* `stopImmediatePropagation()` - stop other listeners from receiving the event

## Examples

* [Media Capture Example](https://github.com/trambarhq/relaks-media-capture-example)
