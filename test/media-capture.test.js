import { expect } from 'chai';
import { MediaCapture } from '../index.mjs';

describe('MediaCapture:', function() {
  beforeEach(function() {
    window.onerror = null;
  })
  describe('#activate()', function() {
    it ('should not throw an error', function() {
      const options = {
        video: true,
        audio: true,
        watchVolume: false,
        silent: true,
      };
      const mediaCapture = new MediaCapture(options);
      mediaCapture.activate();
    })
    it ('should not throw an error (watchVolume = true)', function() {
      const options = {
        video: true,
        audio: true,
        watchVolume: true,
        silent: true,
      };
      const mediaCapture = new MediaCapture(options);
      mediaCapture.activate();
    })
  })
  describe('#deactivate()', function() {
    it ('should not throw an error', function() {
      const options = {
        video: true,
        audio: true,
        watchVolume: false,
        silent: true,
      };
      const mediaCapture = new MediaCapture(options);
      mediaCapture.activate();
      mediaCapture.deactivate();
    })
  })
})
