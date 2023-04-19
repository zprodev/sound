import { settings } from '@pixi/core';
import { WebAudioInstance } from './WebAudioInstance.mjs';
import { WebAudioNodes } from './WebAudioNodes.mjs';

class WebAudioMedia {
  /**
   * Re-initialize without constructing.
   * @param parent - - Instance of parent Sound container
   */
  init(parent) {
    this.parent = parent;
    this._nodes = new WebAudioNodes(this.context);
    this._source = this._nodes.bufferSource;
    this.source = parent.options.source;
  }
  /** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
  destroy() {
    this.parent = null;
    this._nodes.destroy();
    this._nodes = null;
    try {
      this._source.buffer = null;
    } catch (err) {
      console.warn("Failed to set AudioBufferSourceNode.buffer to null:", err);
    }
    this._source = null;
    this.source = null;
  }
  // Implement create
  create() {
    return new WebAudioInstance(this);
  }
  // Implement context
  get context() {
    return this.parent.context;
  }
  // Implement isPlayable
  get isPlayable() {
    return !!this._source && !!this._source.buffer;
  }
  // Implement filters
  get filters() {
    return this._nodes.filters;
  }
  set filters(filters) {
    this._nodes.filters = filters;
  }
  // Implements duration
  get duration() {
    console.assert(this.isPlayable, "Sound not yet playable, no duration");
    return this._source.buffer.duration;
  }
  /** Gets and sets the buffer. */
  get buffer() {
    return this._source.buffer;
  }
  set buffer(buffer) {
    this._source.buffer = buffer;
  }
  /** Get the current chained nodes object */
  get nodes() {
    return this._nodes;
  }
  // Implements load
  load(callback) {
    if (this.source) {
      this._decode(this.source, callback);
    } else if (this.parent.url) {
      this._loadUrl(callback);
    } else if (callback) {
      callback(new Error("sound.url or sound.source must be set"));
    } else {
      console.error("sound.url or sound.source must be set");
    }
  }
  /** Loads a sound using XHMLHttpRequest object. */
  async _loadUrl(callback) {
    const url = this.parent.url;
    const response = await settings.ADAPTER.fetch(url);
    this._decode(await response.arrayBuffer(), callback);
  }
  /**
   * Decodes the array buffer.
   * @param arrayBuffer - From load.
   * @param {Function} callback - Callback optional
   */
  _decode(arrayBuffer, callback) {
    const audioBufferReadyFn = (err, buffer) => {
      if (err) {
        if (callback) {
          callback(err);
        }
      } else {
        this.parent.isLoaded = true;
        this.buffer = buffer;
        const instance = this.parent.autoPlayStart();
        if (callback) {
          callback(null, this.parent, instance);
        }
      }
    };
    if (arrayBuffer instanceof AudioBuffer) {
      audioBufferReadyFn(null, arrayBuffer);
    } else {
      const context = this.parent.context;
      context.decode(arrayBuffer, audioBufferReadyFn);
    }
  }
}

export { WebAudioMedia };
//# sourceMappingURL=WebAudioMedia.mjs.map
