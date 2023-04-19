import { getInstance } from '../instance.mjs';
import { Filter } from './Filter.mjs';

class MonoFilter extends Filter {
  constructor() {
    var __super = (...args) => {
      super(...args);
    };
    if (getInstance().useLegacy) {
      __super(null);
      return;
    }
    const audioContext = getInstance().context.audioContext;
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

export { MonoFilter };
//# sourceMappingURL=MonoFilter.mjs.map
