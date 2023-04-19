'use strict';

var instance = require('../instance.js');
var Filter = require('./Filter.js');

class StreamFilter extends Filter.Filter {
  constructor() {
    var __super = (...args) => {
      super(...args);
    };
    if (instance.getInstance().useLegacy) {
      __super(null);
      return;
    }
    const audioContext = instance.getInstance().context.audioContext;
    const destination = audioContext.createMediaStreamDestination();
    const source = audioContext.createMediaStreamSource(destination.stream);
    __super(destination, source);
    this._stream = destination.stream;
  }
  get stream() {
    return this._stream;
  }
  destroy() {
    this._stream = null;
    super.destroy();
  }
}

exports.StreamFilter = StreamFilter;
//# sourceMappingURL=StreamFilter.js.map
