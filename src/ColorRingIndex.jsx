import colorRing from './ColorRing';
import _Saturation from './Saturation';

let _ColorRing = {};
_ColorRing.ColorRing = colorRing;
_ColorRing.Saturation = _Saturation;

export const ColorRing = colorRing;
export const Saturation = _Saturation;

export default _ColorRing;