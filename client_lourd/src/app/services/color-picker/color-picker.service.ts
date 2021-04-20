import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from '../../components/app/tools/color-picker/color';
import { COLORS, DOT_CHARCODE, LOWER_A_CHARCODE,
         LOWER_F_CHARCODE, NINE_CHARCODE,
         UPPER_A_CHARCODE, UPPER_F_CHARCODE, ZERO_CHARCODE } from '../../components/app/tools/color-picker/constants';
import { IDimensions } from '../../components/app/tools/graphics/graphics-types';

const R_INDEX = 0;
const G_INDEX = 1;
const B_INDEX = 2;
const A_INDEX = 3;

@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {
  static R_INDEX: number = R_INDEX;
  static G_INDEX: number = G_INDEX;
  static B_INDEX: number = B_INDEX;
  static A_INDEX: number = A_INDEX;

  hueManual: BehaviorSubject<Color>;
  hueClick: BehaviorSubject<Color>;
  color: BehaviorSubject<Color>;
  density: BehaviorSubject<Color>;

  constructor() {
    this.hueManual = new BehaviorSubject(COLORS.RED.clone());
    this.hueClick = new BehaviorSubject(COLORS.RED.clone());
    this.color = new BehaviorSubject(COLORS.BLACK.clone());
    this.density = new BehaviorSubject(COLORS.BLACK.clone());
  }

  getPixelColorFromImage(coordinates: { x: number, y: number }, context: CanvasRenderingContext2D): Color {
    // get the image color at (x,y) position
    const imageData = context.getImageData(coordinates.x, coordinates.y, 1, 1).data;
    return new Color(imageData[ColorPickerService.R_INDEX],
                     imageData[ColorPickerService.G_INDEX],
                     imageData[ColorPickerService.B_INDEX],
                     imageData[ColorPickerService.A_INDEX]);
  }

  getCanvasDimensions(canvas: ElementRef<HTMLCanvasElement>): IDimensions {
    return { width: canvas.nativeElement.width, height: canvas.nativeElement.height };
  }

  generatePerfectGradient(gradientStops: Color[], context: CanvasRenderingContext2D, width: number, height: number): CanvasGradient {
    const gradient = context.createLinearGradient(0, 0, width, height);
    const stop = 1 / (gradientStops.length - 1);
    gradientStops.forEach((color: Color, index: number) => {
      gradient.addColorStop(stop * index, color.strFormat());
    });
    return gradient;
  }

  isValidNumericValue(value: string, min: number, max: number, allowDecimals: boolean): boolean {
    if (value.length === 0 ||
        isNaN(+value) ||
        (allowDecimals && value.charCodeAt(value.length - 1) === DOT_CHARCODE)) {
      return false;
    }
    for (const char of value) {
      const charCode = char.charCodeAt(0);
      if (((charCode === DOT_CHARCODE && !allowDecimals) ||
          (charCode <= ZERO_CHARCODE && charCode >= NINE_CHARCODE)) ||
          !(+value >= min && +value <= max)) {
        return false;
      }
    }
    return true;
  }

  isValidHexValue(hex: string): boolean {
    if (hex && hex.charAt(0) === '#') {
      hex = hex.substring(1, Color.HEX_LENGTH + 1);
    }

    let isValid = Color.HEX_LENGTH === hex.length;

    for (const char of hex) {
      const charCode = char.charCodeAt(0);
      if (!((charCode >= LOWER_A_CHARCODE && charCode <= LOWER_F_CHARCODE) ||
           (charCode >= UPPER_A_CHARCODE && charCode <= UPPER_F_CHARCODE) ||
           (charCode >= ZERO_CHARCODE && charCode <= NINE_CHARCODE))) {
        isValid = false;
      }
    }

    isValid = isValid && !isNaN(parseInt(hex.substring(0, Color.R_HEX), Color.HEX));
    isValid = isValid && !isNaN(parseInt(hex.substring(Color.R_HEX, Color.G_HEX), Color.HEX));
    isValid = isValid && !isNaN(parseInt(hex.substring(Color.G_HEX, hex.length), Color.HEX));

    return isValid;
  }
}
