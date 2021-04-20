import { B64_SVG_METADATA } from './graphics-constants';
import { SvgManager } from './svg-manager';

const GET_STRING = 'getString';
const SERIALIZE_TO_STRING = 'serializeToString';
const PARSE_FROM_STRING = 'parseFromString';
const A_STRING = 'string';
const GET_DIMENSIONS = 'getDimensions';
const B64_STR = B64_SVG_METADATA + btoa(A_STRING);
const GET_STRING_FROM_B64 = 'getStringFromB64';
const FROM_STRING = 'fromString';
const CLONE_NODE = 'cloneNode';
const SET_ATTRIBUTE = 'setAttribute';
const GET_ATTRIBUTE = 'getAttribute';
const NONE_STYLE = 'none';
const BLOCK_STYLE = 'block';

const FAKE_SVG = {
  getBoundingClientRect: () => {
    return {width: 10, height: 5};
  },
  getAttribute: () => {
    // fake function
    return '1';
  },
  setAttribute: () => {
    // fake function
  },
  cloneNode: () => {
    // fake function
  },
  style: {
    display: A_STRING
  }
} as unknown as SVGElement;

const FAKE_SVG_2 = {
  getBoundingClientRect: () => {
    return {width: 5, height: 10};
  }
} as SVGElement;

const FAKE_DOCUMENT = {
  // fake obj
} as Document;

const WIDTH_RATIO = 1;
const HEIGHT_RATIO = 0.5;

const WIDTH_RATIO_2 = 0.5;
const HEIGHT_RATIO_2 = 1;

describe('SvgManager', () => {
  it('getB64 should call getString and convert it to base64', () => {
    spyOn(SvgManager, GET_STRING);

    SvgManager.getB64(FAKE_SVG);

    expect(SvgManager.getString).toHaveBeenCalled();
  });

  it('getString should call serializeToString', () => {
    const spy = spyOn(XMLSerializer.prototype, SERIALIZE_TO_STRING);

    SvgManager.getB64(FAKE_SVG);

    expect(spy).toHaveBeenCalled();
  });

  it('getStringFromB64 should remove b64 svg metadata and decode it to a b10 string', () => {
    const returnValue = SvgManager.getStringFromB64(B64_STR);

    expect(returnValue).toBe(A_STRING);
  });

  it('getUrl should call getString', () => {
    spyOn(SvgManager, GET_STRING);

    SvgManager.getUrl(FAKE_SVG);

    expect(SvgManager.getString).toHaveBeenCalled();
  });

  it('getAspectRatio should call getBoundingClientRect and return a ratio with width being 1', () => {
    const spy = spyOn(SvgManager, GET_DIMENSIONS).and.returnValue(FAKE_SVG.getBoundingClientRect());

    const returnValue = SvgManager.getAspectRatio(FAKE_SVG);

    expect(returnValue.width).toBe(WIDTH_RATIO);
    expect(returnValue.height).toBe(HEIGHT_RATIO);
    expect(spy).toHaveBeenCalled();
  });

  it('getAspectRatio should call getBoundingClientRect and return a ratio with height being 1', () => {
    const spy = spyOn(SvgManager, GET_DIMENSIONS).and.returnValue(FAKE_SVG_2.getBoundingClientRect());

    const returnValue = SvgManager.getAspectRatio(FAKE_SVG_2);

    expect(returnValue.width).toBe(WIDTH_RATIO_2);
    expect(returnValue.height).toBe(HEIGHT_RATIO_2);
    expect(spy).toHaveBeenCalled();
  });

  it('getAspectRatio should do nothing and return 1:1 if dimensions evaluates to false', () => {
    const spy = spyOn(SvgManager, GET_DIMENSIONS);

    const returnValue = SvgManager.getAspectRatio(FAKE_SVG_2);

    expect(returnValue.width).toBe(WIDTH_RATIO);
    expect(returnValue.height).toBe(HEIGHT_RATIO_2);
    expect(spy).toHaveBeenCalled();
  });

  it('fromString should call parseFromString', () => {
    const spy = spyOn(DOMParser.prototype, PARSE_FROM_STRING).and.returnValue(FAKE_DOCUMENT);

    SvgManager.fromString(A_STRING);

    expect(spy).toHaveBeenCalled();
  });

  it('fromB64Str should call slice to remove the svg metadata', () => {
    const spyStringFromB64 = spyOn(SvgManager, GET_STRING_FROM_B64);
    const spyFromString = spyOn(SvgManager, FROM_STRING);

    SvgManager.fromB64Str(A_STRING);

    expect(spyStringFromB64).toHaveBeenCalled();
    expect(spyFromString).toHaveBeenCalled();
  });

  it('clone should return a clone svg object by calling cloneNode', () => {
    const spy = spyOn(FAKE_SVG, CLONE_NODE);

    SvgManager.clone(FAKE_SVG);

    expect(spy).toHaveBeenCalled();
  });

  it('resize should call setAttribute twice, for width and height', () => {
    const spy = spyOn(FAKE_SVG, SET_ATTRIBUTE);

    SvgManager.resize(FAKE_SVG, FAKE_SVG_2.getBoundingClientRect());

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('setFilter should call setAttribute of filter', () => {
    const spy = spyOn(FAKE_SVG, SET_ATTRIBUTE);

    SvgManager.setFilter(FAKE_SVG, A_STRING);

    expect(spy).toHaveBeenCalled();
  });

  it('getDimensions should call getAttribute twice, for width and height', () => {
    const spy = spyOn(FAKE_SVG, GET_ATTRIBUTE);

    SvgManager.getDimensions(FAKE_SVG);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('setHidden should set the display style to none if hidden is true', () => {
    SvgManager.setHidden(FAKE_SVG, true);

    expect(FAKE_SVG.style.display).toBe(NONE_STYLE);
  });

  it('setHidden should set the display style to block if hidden is false', () => {
    SvgManager.setHidden(FAKE_SVG, false);

    expect(FAKE_SVG.style.display).toBe(BLOCK_STYLE);
  });

  it('setStyle should call setAttribute on style', () => {
    const spy = spyOn(FAKE_SVG, SET_ATTRIBUTE);

    SvgManager.setStyle(FAKE_SVG, A_STRING);

    expect(spy).toHaveBeenCalled();
  });

  it('getDimensions should return ', () => {
    const spy = spyOn(FAKE_SVG, GET_ATTRIBUTE).and.callThrough();

    SvgManager.getDimensions(FAKE_SVG);

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
