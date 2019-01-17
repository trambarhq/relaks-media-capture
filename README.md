Relaks Media Capture
====================

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

### audioBitsPerSecond

### audioMIMEType

### captureImageOnly

### chooseNewDevice

### deactivationDelay

### imageMIMEType

### preferredDevice

### segmentDuration

### video

### videoBitsPerSecond

### videoMIMEType

### watchVolume

## Properties

* [active](#active)
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

### duration

Duration of the captured video/audio. `undefined` initially.

### lastError

The last error encountered.

### liveAudio

An object representing the input from the microphone, with the following properties

* `stream` - An instance of `MediaStream`

It's only available when [`audio`](#audio) is `true` and [`video`](#video) is `false`.

### liveVideo

An object representing the input from the camera, with the following properties

* `stream` - An instance of `MediaStream`
* `height` - The height of the video
* `width` - The width of the video

It's available when [`video`](#video) is `true`.

`height` and `width` will swap when the user rotates a phone or tablet.

### devices

### selectedDeviceID

ID of the currently selected camera.

### status

One of the following:

* "acquiring" - In the process of acquiring a camera
* "denied" - Permission to use camera has been denied
* "initiating" - Permission has been granted and the camera is about to become available
* "previewing" - Camera input is available
* "capturing" - Video/audio capturing is happening
* "paused" - Video/audio capturing has been paused
* "captured" - A video, audio, or image has been captured

### volume

A number between 0 and 100 indicating the strength of audio coming from the microphone.

It's present only when [`watchVolume`](#watchvolume) is `true`.

## Methods

**Event listeners:**

* [addEventListener](#addeventlistener)
* [removeEventListener](#removeeventlistener)
* [waitForEvent](#waitforevent)

**Activation**

* [activate()](#activate)
* [deactivate()](#deactivate)

**Video/audio capture:**

* [pause](#pause)
* [resume](#resume)
* [start](#start)
* [stop](#stop)

**Image capture:**

* [snap](#snap)

**Others:**

* [change](#change)
* [choose](#choose)
* [clear](#clear)

### addEventListener

```typescript
function addEventListener(type: string, handler: function, beginning?:boolean): void
```

Add an event listener to the route manager. `handler` will be called whenever events of `type` occur. When `beginning` is true, the listener will be place before any existing listeners. Otherwise it's added at the end of the list.

Inherited from [relaks-event-emitter](https://github.com/trambarhq/relaks-event-emitter).

### removeEventListener

```typescript
function removeEventListener(type: string, handler: function): void
```

Remove an event listener from the route manager. `handler` and `type` must match what was given to `addEventListener()`.

Inherited from [relaks-event-emitter](https://github.com/trambarhq/relaks-event-emitter).

### waitForEvent

```typescript
async function waitForEvent(type: string): Event
```

Return a promise that is fulfilled when an event of the specified type occurs.

Inherited from [relaks-event-emitter](https://github.com/trambarhq/relaks-event-emitter).

### activate

```typescript
function activate(): void
```

Activate the media capture object.

### deactivate

```typescript
function deactivate(): void
```

Deactivate the media capture object.

### pause

```typescript
function pause(): void
```

Pause capturing. [`status`](#status) will change to `"pause"`.

### resume

```typescript
function resume(): void
```

Resume capturing. [`status`](#status) will become `"capturing"` again.

### start

```typescript
function start(): void
```

Start capturing video and/or audio. [`status`](#status) will change to `"capturing"`.

### stop

```typescript
function stop(): void
```

Stop capturing. [`status`](#status) will change to `"captured"` soon afterward.

### snap

```typescript
function snap(): void
```

Take a snapshot of the camera input. The result will be stored in [`capturedImage`](#captureimage).

[`status`](#status) will become `"captured"` afterward if [`captureImageOnly`](#captureimageonly) is `true`.

### change

```typescript
async function change(): Event
```

Wait for a [`change`](#change-2) event to occur.

### choose

```typescript
function choose(id: String): void
```

Choose the camera or mic with the specified ID as the recording device.

### clear

```typescript
function clear(): void
```

Clear [`capturedVideo`](#capturedvideo), [`capturedAudio`](#capturedaudio), and [`capturedImage`](#capturedimage). Return to previewing.

## Events

* [change](#change-2)
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

## chunk

When [segmentDuration](#segmentduration) is set, the `chunk` event is emitted when a chunk of data become available.

**Properties:**

* `blob` - a `Blob` containing data of a video/audio segment
* `propagationStopped` - whether `stopImmediatePropagation()` was called
* `target` - media capture object
* `type` - `"change"`

**Methods:**

* `stopImmediatePropagation()` - stop other listeners from receiving the event

## chunk

When [segmentDuration](#segmentduration) is set, the `end` event is emitted when video recording has come to an end, after the final `chunk` event has occurred.

**Properties:**

* `propagationStopped` - whether `stopImmediatePropagation()` was called
* `target` - media capture object
* `type` - `"change"`

**Methods:**

* `stopImmediatePropagation()` - stop other listeners from receiving the event

## Examples

* [Media Capture Example](https://github.com/trambarhq/relaks-media-capture-example)
