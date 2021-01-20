import { Color } from '../color-picker/color';
import {
  B_CLAMPED_INDEX, B_GRAYSCALE_FACTOR, BRIGHTNESS_FACTOR,
  G_CLAMPED_INDEX,
  G_GRAYSCALE_FACTOR, IMAGE_DATA_STEP, PERCENT,
  R_CLAMPED_INDEX,
  R_GRAYSCALE_FACTOR, TINT_FACTOR,
} from './graphics-constants';
import { FilterCallback } from './graphics-types';

export class ImageManager {
  static applyFilter = (colorData: Uint8ClampedArray, filter: FilterCallback) => {
    for (let i = 0; i < colorData.length; i += IMAGE_DATA_STEP) {
      filter(colorData, i);
    }
  }

  static applyGrayscaleTint = (colorData: Uint8ClampedArray, clampedPixelDataIndex: number, tintIndex: number): void => {
    ImageManager.grayscaleFilterPattern(colorData, clampedPixelDataIndex);
    colorData[tintIndex] *= TINT_FACTOR;
  }

  static invertFilterPattern = (colorData: Uint8ClampedArray, clampedPixelDataIndex: number): void => {
    colorData[clampedPixelDataIndex + R_CLAMPED_INDEX] = Color.MAX_COLOR - colorData[clampedPixelDataIndex + R_CLAMPED_INDEX];
    colorData[clampedPixelDataIndex + G_CLAMPED_INDEX] = Color.MAX_COLOR - colorData[clampedPixelDataIndex + G_CLAMPED_INDEX];
    colorData[clampedPixelDataIndex + B_CLAMPED_INDEX] = Color.MAX_COLOR - colorData[clampedPixelDataIndex + B_CLAMPED_INDEX];
  }

  static brightnessIncreaseFilterPattern = (colorData: Uint8ClampedArray, clampedPixelDataIndex: number): void => {
    colorData[clampedPixelDataIndex + R_CLAMPED_INDEX] += Color.MAX_COLOR * BRIGHTNESS_FACTOR / PERCENT;
    colorData[clampedPixelDataIndex + G_CLAMPED_INDEX] += Color.MAX_COLOR * BRIGHTNESS_FACTOR / PERCENT;
    colorData[clampedPixelDataIndex + B_CLAMPED_INDEX] += Color.MAX_COLOR * BRIGHTNESS_FACTOR / PERCENT;
  }

  static brightnessDecreaseFilterPattern = (colorData: Uint8ClampedArray, clampedPixelDataIndex: number): void => {
    colorData[clampedPixelDataIndex + R_CLAMPED_INDEX] += Color.MAX_COLOR * -BRIGHTNESS_FACTOR / PERCENT;
    colorData[clampedPixelDataIndex + G_CLAMPED_INDEX] += Color.MAX_COLOR * -BRIGHTNESS_FACTOR / PERCENT;
    colorData[clampedPixelDataIndex + B_CLAMPED_INDEX] += Color.MAX_COLOR * -BRIGHTNESS_FACTOR / PERCENT;
  }

  static grayscaleFilterPattern = (colorData: Uint8ClampedArray, clampedPixelDataIndex: number): void => {
    const rgb = (R_GRAYSCALE_FACTOR * colorData[clampedPixelDataIndex + R_CLAMPED_INDEX]) +
                (G_GRAYSCALE_FACTOR * colorData[clampedPixelDataIndex + G_CLAMPED_INDEX]) +
                (B_GRAYSCALE_FACTOR * colorData[clampedPixelDataIndex + B_CLAMPED_INDEX]);
    colorData[clampedPixelDataIndex + R_CLAMPED_INDEX] = rgb;
    colorData[clampedPixelDataIndex + G_CLAMPED_INDEX] = rgb;
    colorData[clampedPixelDataIndex + B_CLAMPED_INDEX] = rgb;
  }

  static redTintGrayscaleFilterPattern = (colorData: Uint8ClampedArray, clampedPixelDataIndex: number): void => {
    ImageManager.applyGrayscaleTint(colorData, clampedPixelDataIndex, clampedPixelDataIndex + R_CLAMPED_INDEX);
  }

  static greenTintGrayscaleFilterPattern = (colorData: Uint8ClampedArray, clampedPixelDataIndex: number): void => {
    ImageManager.applyGrayscaleTint(colorData, clampedPixelDataIndex, clampedPixelDataIndex + G_CLAMPED_INDEX);
  }

  static blueTintGrayscaleFilterPattern = (colorData: Uint8ClampedArray, clampedPixelDataIndex: number): void => {
    ImageManager.applyGrayscaleTint(colorData, clampedPixelDataIndex, clampedPixelDataIndex + B_CLAMPED_INDEX);
  }
}
