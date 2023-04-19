import { getInstance } from '../instance.mjs';
import { Filter } from './Filter.mjs';

class StreamFilter extends Filter {
  constructor() {
    var __super = (...args) => {
      super(...args);
    };
    if (getInstance().useLegacy) {
      __super(null);
      return;
    }
    const audioContext = getInstance().context.audioContext;
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

export { StreamFilter };
//# sourceMappingURL=StreamFilter.mjs.map
