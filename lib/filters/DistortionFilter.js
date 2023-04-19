'use strict';

var instance = require('../instance.js');
var Filter = require('./Filter.js');

class DistortionFilter extends Filter.Filter {
  /** @param amount - The amount of distoration from 0 to 1. */
  constructor(amount = 0) {
    var __super = (...args) => {
      super(...args);
    };
    if (instance.getInstance().useLegacy) {
      __super(null);
      return;
    }
    const { context } = instance.getInstance();
    const distortion = context.audioContext.createWaveShaper();
    __super(distortion);
    this._distortion = distortion;
    this.amount = amount;
  }
  /** The amount of distortion to set. */
  set amount(value) {
    this._amount = value;
    const scaledValue = value * 1e3;
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    let i = 0;
    let x;
    for (; i < samples; ++i) {
      x = i * 2 / samples - 1;
      curve[i] = (3 + scaledValue) * x * 20 * deg / (Math.PI + scaledValue * Math.abs(x));
    }
    this._distortion.curve = curve;
    this._distortion.oversample = "4x";
  }
  get amount() {
    return this._amount;
  }
  destroy() {
    this._distortion = null;
    super.destroy();
  }
}

exports.DistortionFilter = DistortionFilter;
//# sourceMappingURL=DistortionFilter.js.map
