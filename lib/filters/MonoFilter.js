'use strict';

var instance = require('../instance.js');
var Filter = require('./Filter.js');

class MonoFilter extends Filter.Filter {
  constructor() {
    var __super = (...args) => {
      super(...args);
    };
    if (instance.getInstance().useLegacy) {
      __super(null);
      return;
    }
    const audioContext = instance.getInstance().context.audioContext;
    const splitter = audioContext.createChannelSplitter();
    const merger = audioContext.createChannelMerger();
    merger.connect(splitter);
    __super(merger, splitter);
    this._merger = merger;
  }
  destroy() {
    this._merger.disconnect();
    this._merger = null;
    super.destroy();
  }
}

exports.MonoFilter = MonoFilter;
//# sourceMappingURL=MonoFilter.js.map
