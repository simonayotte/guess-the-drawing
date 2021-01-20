const MIN_ALPHA = 0;
const MAX_ALPHA = 1;
const MAX_COLOR = 255;
const MIN_COLOR = 0;
const MAX_HUE = 359;
const HEX = 16;
const HEX_LENGTH = 6;
const HEX_VALUE_LENGTH = 2;
const HEX_PADDING = '0';
const R_HEX = 2;
const G_HEX = 4;
const B_HEX = 6;
const MAX_DEGREES = 360;
const COLOR_DEGREES = 60;

export class Color {

  constructor(r: number, g: number, b: number, a: number) {
    this.r = Color.validateColor(r);
    this.g = Color.validateColor(g);
    this.b = Color.validateColor(b);
    this.a = Color.validateAlpha(a);
    this.refreshVariables();
  }

  // Constants
  static readonly MIN_ALPHA: number = MIN_ALPHA;
  static readonly MAX_ALPHA: number = MAX_ALPHA;
  static readonly MAX_COLOR: number = MAX_COLOR;
  static readonly MIN_COLOR: number = MIN_COLOR;
  static readonly MAX_HUE: number = MAX_HUE;
  static readonly HEX: number = HEX;
  static readonly HEX_LENGTH: number = HEX_LENGTH;
  static readonly HEX_VALUE_LENGTH: number = HEX_VALUE_LENGTH;
  static readonly HEX_PADDING: string = HEX_PADDING;
  static readonly R_HEX: number = R_HEX;
  static readonly G_HEX: number = G_HEX;
  static readonly B_HEX: number = B_HEX;
  static readonly MAX_DEGREES: number = MAX_DEGREES;
  static readonly COLOR_DEGREES: number = COLOR_DEGREES;

  // Variables
  private r: number;
  private g: number;
  private b: number;
  private a: number;
  private rPrime: number;
  private gPrime: number;
  private bPrime: number;
  private colorMax: number;
  private colorMin: number;
  private delta: number;

  // Functions
  static strFormatRGBA(r: number, g: number, b: number, a: number): string {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  static dictFormatRGBA(red: number, green: number, blue: number, alpha: number): {r: number, g: number, b: number, a: number} {
    return {r: red, g: green, b: blue, a: alpha};
  }

  static getRGBFromHex(hex: string): Color {
    if (hex && hex.charAt(0) === '#') {
      hex = hex.substring(1, Color.HEX_LENGTH + 1);
    }

    let r = Color.MAX_COLOR;
    let g = Color.MAX_COLOR;
    let b = Color.MAX_COLOR;

    if (hex.length === Color.HEX_LENGTH) {
      r = parseInt(hex.substring(0, Color.R_HEX), Color.HEX);
      g = parseInt(hex.substring(Color.R_HEX, Color.G_HEX), Color.HEX);
      b = parseInt(hex.substring(Color.G_HEX, hex.length), Color.HEX);
    }

    r = (isNaN(r)) ? Color.MAX_COLOR : r;
    g = (isNaN(g)) ? Color.MAX_COLOR : g;
    b = (isNaN(b)) ? Color.MAX_COLOR : b;

    return new Color(r, g, b, Color.MAX_ALPHA);
  }

  static validateColor(color: number): number {
    if (color > Color.MAX_COLOR) {
      color = Color.MAX_COLOR;
    } else if (color < Color.MIN_COLOR) {
      color = Color.MIN_COLOR;
    }
    return color;
  }

  static validateAlpha(alpha: number): number {
    if (alpha > Color.MAX_ALPHA) {
      alpha = Color.MAX_ALPHA;
    } else if (alpha < Color.MIN_ALPHA) {
      alpha = Color.MIN_ALPHA;
    }
    return alpha;
  }

  static hexColorValueToStr(value: number): string {
    let str = value.toString(Color.HEX);
    if (str.length < Color.HEX_VALUE_LENGTH) {
      str = Color.HEX_PADDING + str;
    }
    return str.toUpperCase();
  }

  private refreshVariables(): void {
    this.rPrime = this.r / Color.MAX_COLOR;
    this.gPrime = this.g / Color.MAX_COLOR;
    this.bPrime = this.b / Color.MAX_COLOR;
    this.colorMax = Math.max(this.rPrime, this.gPrime, this.bPrime);
    this.colorMin = Math.min(this.rPrime, this.gPrime, this.bPrime);
    this.delta = this.colorMax - this.colorMin;
  }

  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  strFormat(): string {
    return Color.strFormatRGBA(this.r, this.g, this.b, this.a);
  }

  setR(r: number): void {
    this.r = Color.validateColor(r);
    this.refreshVariables();
  }

  setG(g: number): void {
    this.g = Color.validateColor(g);
    this.refreshVariables();
  }

  setB(b: number): void {
    this.b = Color.validateColor(b);
    this.refreshVariables();
  }

  setA(a: number): void {
    this.a = Color.validateAlpha(a);
  }

  setRGBFromHex(hex: string): void {
    const color = Color.getRGBFromHex(hex);
    this.setR(color.getR());
    this.setG(color.getG());
    this.setB(color.getB());
  }

  getR(): number {
    return this.r;
  }

  getG(): number {
    return this.g;
  }

  getB(): number {
    return this.b;
  }

  getA(): number {
    return this.a;
  }

  getHue(): number {
    // rgb to hue formula
    let hue = 0;

    if (this.delta !== 0) {
      if (this.colorMax === this.rPrime) {
        hue = ((this.gPrime - this.bPrime) / this.delta) % Color.B_HEX;
      } else if (this.colorMax === this.gPrime) {
        hue = ((this.bPrime - this.rPrime) / this.delta) + Color.R_HEX;
      } else {
        hue = ((this.rPrime - this.gPrime) / this.delta) + Color.G_HEX;
      }
    }

    hue *= Color.COLOR_DEGREES;

    if (hue < 0) {
      hue += Color.MAX_DEGREES;
    }

    return hue;
  }

  getLightness(): number {
    // rgb to lightness formula
    return (this.colorMax + this.colorMin) / 2;
  }

  getSaturation(): number {
    // rgb to saturation formula
    let saturation = 0;
    if (this.delta !== 0) {
      saturation = (this.delta / this.colorMax);
    }
    return saturation;
  }

  getHSV(): {H: number, S: number, V: number} {
    return {H: this.getHue(), S: this.getSaturation(), V: this.colorMax};
  }

  strFormatHex = (): string => {
    const rStr = Color.hexColorValueToStr(this.r);
    const gStr = Color.hexColorValueToStr(this.g);
    const bStr = Color.hexColorValueToStr(this.b);
    return `${rStr}${gStr}${bStr}`;
  }
}
