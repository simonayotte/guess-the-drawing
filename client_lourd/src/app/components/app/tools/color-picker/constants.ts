import { Color } from './color';

export const KNOB_HEIGHT = 20;
export const KNOB_POSITION = -1;
export const ZERO_CHARCODE = '0'.charCodeAt(0);
export const NINE_CHARCODE = '9'.charCodeAt(0);
export const DOT_CHARCODE = '.'.charCodeAt(0);
export const LOWER_A_CHARCODE = 'a'.charCodeAt(0);
export const UPPER_A_CHARCODE = 'A'.charCodeAt(0);
export const LOWER_F_CHARCODE = 'f'.charCodeAt(0);
export const UPPER_F_CHARCODE = 'F'.charCodeAt(0);
export const LOWER_Z_CHARCODE = 'z'.charCodeAt(0);
export const UPPER_Z_CHARCODE = 'Z'.charCodeAt(0);
export const UNDERSCORE_CHARCODE = '_'.charCodeAt(0);

export let COLORS = {
  RED: new Color(Color.MAX_COLOR, Color.MIN_COLOR, Color.MIN_COLOR, Color.MAX_ALPHA),
  YELLOW: new Color(Color.MAX_COLOR, Color.MAX_COLOR, Color.MIN_COLOR, Color.MAX_ALPHA),
  GREEN: new Color(Color.MIN_COLOR, Color.MAX_COLOR, Color.MIN_COLOR, Color.MAX_ALPHA),
  TURQUOISE: new Color(Color.MIN_COLOR, Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_ALPHA),
  BLUE: new Color(Color.MIN_COLOR, Color.MIN_COLOR, Color.MAX_COLOR, Color.MAX_ALPHA),
  MAGENTA: new Color(Color.MAX_COLOR, Color.MIN_COLOR, Color.MAX_COLOR, Color.MAX_ALPHA),
  WHITE: new Color(Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_ALPHA),
  TRANSPARENT_WHITE: new Color(Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_COLOR, Color.MIN_ALPHA),
  BLACK: new Color(Color.MIN_COLOR, Color.MIN_COLOR, Color.MIN_COLOR, Color.MAX_ALPHA),
  TRANSPARENT_BLACK: new Color(Color.MIN_COLOR, Color.MIN_COLOR, Color.MIN_COLOR, Color.MIN_ALPHA)
};

export let WHITE_GRADIENT_STOPS: Color[] = [
  COLORS.WHITE,
  COLORS.TRANSPARENT_WHITE
];

export let BLACK_GRADIENT_STOPS: Color[] = [
  COLORS.TRANSPARENT_BLACK,
  COLORS.BLACK
];

export let RAINBOW_GRADIENT_STOPS: Color[] = [
  COLORS.RED,
  COLORS.YELLOW,
  COLORS.GREEN,
  COLORS.TURQUOISE,
  COLORS.BLUE,
  COLORS.MAGENTA,
  COLORS.RED
];
