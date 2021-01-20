import { Color } from './color';
import { COLORS } from './constants';

// Initial values
const R = 0;
const B = 0;
const G = 0;
const A = 1;

// Functions to test
const STR_FORMAT_RGBA = 'strFormatRGBA';
const GET_RGB_FROM_HEX = 'getRGBFromHex';
const VALIDATE_COLOR = 'validateColor';
const VALIDATE_ALPHA = 'validateAlpha';
const HEX_COLOR_VALUE_TO_STR = 'hexColorValueToStr';
const SET_R = 'setR';
const SET_G = 'setG';
const SET_B = 'setB';
const COLOR_MAX = 'colorMax';

// Test values
const RGBA_STR = 'rgba';
const R_STR = R.toString();
const G_STR = G.toString();
const B_STR = B.toString();
const A_STR = A.toString();

const R_KEY = 'r';
const G_KEY = 'g';
const B_KEY = 'b';
const A_KEY = 'a';
const H_KEY = 'H';
const S_KEY = 'S';
const V_KEY = 'V';

const HEX = '000000';
const HEX_VALUE = 0xFF;
const HEX_VALUE_STR = 'FF';
const HEX_WHITE = 'FFFFFF';
const HEX_WITH_HASHTAG = '#000000';
const INVALID_HEX = '00000';
const INVALID_HEX_2 = 'zzzzzz';

const RGBA_VALID_VALUE = 100;
const RGBA_NEGATIVE_VALUE = -5;
const RGBA_OUT_OF_BOUNDS_VALUE = 300;

const ALPHA_VALID_VALIE = 0.5;
const ALPHA_NEGATIVE_VALUE = -0.1;
const ALPHA_OUT_OF_BOUNDS_VALUE = 1.1;

const BLACK_HUE = 0;
const MAGENTA_HUE = 300;
const TURQUOISE_HUE = 180;
const BLUE_HUE = 240;

const BLACK_LIGHTNESS = 0;
const WHITE_LIGHTNESS = 1;
const YELLOW_LIGHTNESS = 0.5;

const BLACK_SATURATION = 0;
const YELLOW_SATURATION = 1;

// Testing
describe('Color', () => {
  let color: Color;

  beforeEach(() => {
    color = new Color(R, G, B, A);
  });

  // strFormatRGBA()
  it ('should return an rgba formatted string with strFormatRGBA', () => {
    const returnValue = Color.strFormatRGBA(R, G, B, A);
    expect(returnValue).toContain(RGBA_STR);
    expect(returnValue).toContain(R_STR);
    expect(returnValue).toContain(G_STR);
    expect(returnValue).toContain(B_STR);
    expect(returnValue).toContain(A_STR);
  });

  // dictFormatRGBA()
  it ('should return an object of colors with dictFormatRGBA', () => {
    const returnValue = Color.dictFormatRGBA(R, G, B, A);
    expect(R_KEY in returnValue).toBeTruthy();
    expect(G_KEY in returnValue).toBeTruthy();
    expect(B_KEY in returnValue).toBeTruthy();
    expect(A_KEY in returnValue).toBeTruthy();
    expect(returnValue.r).toBe(R);
    expect(returnValue.g).toBe(G);
    expect(returnValue.b).toBe(B);
    expect(returnValue.a).toBe(A);
  });

  // getRGBFromHex()
  it ('should return a color created from an hex value with getRGBFromHex', () => {
    let returnValue = Color.getRGBFromHex(HEX);
    expect(returnValue.getR()).toBe(COLORS.BLACK.getR());
    expect(returnValue.getG()).toBe(COLORS.BLACK.getG());
    expect(returnValue.getB()).toBe(COLORS.BLACK.getB());
    expect(returnValue.getA()).toBe(COLORS.BLACK.getA());

    returnValue = Color.getRGBFromHex(HEX_WITH_HASHTAG);
    expect(returnValue.getR()).toBe(COLORS.BLACK.getR());
    expect(returnValue.getG()).toBe(COLORS.BLACK.getG());
    expect(returnValue.getB()).toBe(COLORS.BLACK.getB());
    expect(returnValue.getA()).toBe(COLORS.BLACK.getA());

    returnValue = Color.getRGBFromHex(INVALID_HEX);
    expect(returnValue.getR()).toBe(COLORS.WHITE.getR());
    expect(returnValue.getG()).toBe(COLORS.WHITE.getG());
    expect(returnValue.getB()).toBe(COLORS.WHITE.getB());
    expect(returnValue.getA()).toBe(COLORS.WHITE.getA());

    returnValue = Color.getRGBFromHex(INVALID_HEX_2);
    expect(returnValue.getR()).toBe(Color.MAX_COLOR);
    expect(returnValue.getG()).toBe(Color.MAX_COLOR);
    expect(returnValue.getB()).toBe(Color.MAX_COLOR);
    expect(returnValue.getA()).toBe(Color.MAX_ALPHA);
  });

  // validateColor()
  it ('should return a valid color value', () => {
    let returnValue = Color[VALIDATE_COLOR](RGBA_VALID_VALUE);
    expect(returnValue).toBe(RGBA_VALID_VALUE);

    returnValue = Color[VALIDATE_COLOR](RGBA_NEGATIVE_VALUE);
    expect(returnValue).toBe(Color.MIN_COLOR);

    returnValue = Color[VALIDATE_COLOR](RGBA_OUT_OF_BOUNDS_VALUE);
    expect(returnValue).toBe(Color.MAX_COLOR);
  });

  // validateAlpha()
  it ('should return a valid alpha value', () => {
    let returnValue = Color[VALIDATE_ALPHA](ALPHA_VALID_VALIE);
    expect(returnValue).toBe(ALPHA_VALID_VALIE);

    returnValue = Color[VALIDATE_ALPHA](ALPHA_NEGATIVE_VALUE);
    expect(returnValue).toBe(Color.MIN_ALPHA);

    returnValue = Color[VALIDATE_ALPHA](ALPHA_OUT_OF_BOUNDS_VALUE);
    expect(returnValue).toBe(Color.MAX_ALPHA);
  });

  // strFormat()
  it ('should call strFormatRGBA with strFormat', () => {
    spyOn(Color, STR_FORMAT_RGBA);

    color.strFormat();
    expect(Color.strFormatRGBA).toHaveBeenCalled();
  });

  // setR()
  it ('should call validateColor with setR', () => {
    spyOn(Color, VALIDATE_COLOR).and.returnValue(R);

    color.setR(R);
    expect(Color[VALIDATE_COLOR]).toHaveBeenCalled();
  });

  // setG()
  it ('should call validateColor with setG', () => {
    spyOn(Color, VALIDATE_COLOR).and.returnValue(G);

    color.setG(G);
    expect(Color[VALIDATE_COLOR]).toHaveBeenCalled();
  });

  // setB()
  it ('should call validateColor with setB', () => {
    spyOn(Color, VALIDATE_COLOR).and.returnValue(B);

    color.setB(B);
    expect(Color[VALIDATE_COLOR]).toHaveBeenCalled();
  });

  // setA()
  it ('should call validateAlpha with setA', () => {
    spyOn(Color, VALIDATE_ALPHA).and.returnValue(A);

    color.setA(A);
    expect(Color[VALIDATE_ALPHA]).toHaveBeenCalled();
  });

  // getR()
  it ('should return r value with getR', () => {
    const returnValue = color.getR();
    expect(returnValue).toBe(R);
  });

  // getG()
  it ('should return g value with getG', () => {
    const returnValue = color.getG();
    expect(returnValue).toBe(G);
  });

  // getB()
  it ('should return b value with getB', () => {
    const returnValue = color.getB();
    expect(returnValue).toBe(B);
  });

  // getR()
  it ('should return a value with getA', () => {
    const returnValue = color.getA();
    expect(returnValue).toBe(A);
  });

  // clone()
  it ('should return a new instance of Color with clone', () => {
    const returnValue = color.clone();
    returnValue.setR(Color.MAX_COLOR);
    expect(returnValue.getR()).toBe(Color.MAX_COLOR);
    expect(color.getR()).toBe(R);
  });

  // setRGBFromhex()
  it ('should set rgb values from hex value with setRGBFromHex', () => {
    spyOn(Color, GET_RGB_FROM_HEX).and.returnValue(COLORS.WHITE.clone());
    spyOn(color, SET_R);
    spyOn(color, SET_G);
    spyOn(color, SET_B);

    color.setRGBFromHex(HEX_WHITE);

    expect(Color.getRGBFromHex).toHaveBeenCalled();
    expect(color.setR).toHaveBeenCalled();
    expect(color.setG).toHaveBeenCalled();
    expect(color.setB).toHaveBeenCalled();
  });

  // getHue()
  it ('should return hue value from rgba values with getHue', () => {
    let returnValue = color.getHue();
    expect(returnValue).toBe(BLACK_HUE);

    color = COLORS.BLUE.clone();
    returnValue = color.getHue();
    expect(returnValue).toBe(BLUE_HUE);

    color = COLORS.MAGENTA.clone();
    returnValue = color.getHue();
    expect(returnValue).toBe(MAGENTA_HUE);

    color = COLORS.TURQUOISE.clone();
    returnValue = color.getHue();
    expect(returnValue).toBe(TURQUOISE_HUE);
  });

  // getLightness()
  it ('should return lightness value with getLightness', () => {
    let returnValue = color.getLightness();
    expect(returnValue).toBe(BLACK_LIGHTNESS);

    color = COLORS.WHITE.clone();
    returnValue = color.getLightness();
    expect(returnValue).toBe(WHITE_LIGHTNESS);

    color = COLORS.YELLOW.clone();
    returnValue = color.getLightness();
    expect(returnValue).toBe(YELLOW_LIGHTNESS);
  });

  // getSaturation()
  it ('should return saturation value with getSaturation', () => {
    let returnValue = color.getSaturation();
    expect(returnValue).toBe(BLACK_SATURATION);

    color = COLORS.YELLOW;
    returnValue = color.getSaturation();
    expect(returnValue).toBe(YELLOW_SATURATION);
  });

  // getHSV
  it ('should return an object of H, S and V with getHSV', () => {
    const returnValue = color.getHSV();
    expect(H_KEY in returnValue).toBeTruthy();
    expect(S_KEY in returnValue).toBeTruthy();
    expect(V_KEY in returnValue).toBeTruthy();
    expect(returnValue.H).toBe(color.getHue());
    expect(returnValue.S).toBe(color.getSaturation());
    expect(returnValue.V).toBe(color[COLOR_MAX]);
  });

  // hexColorValueToStr
  it ('should return a formatted string of hex color value with hexColorValueToStr', () => {
    const returnValue = Color[HEX_COLOR_VALUE_TO_STR](HEX_VALUE);
    expect(returnValue).toBe(HEX_VALUE_STR);
  });

  // strFormatHex
  it ('should return a formatted string of hex value with strFormatHex', () => {
    const returnValue = color.strFormatHex();
    expect(returnValue).toBe(HEX);
  });
});
