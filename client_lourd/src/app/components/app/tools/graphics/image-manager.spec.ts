import { Color } from '../color-picker/color';
import { ImageManager } from './image-manager';

const INVERT_FILTER_PATTERN = 'invertFilterPattern';
const GRAYSCALE_FILTER_PATTERN = 'grayscaleFilterPattern';
const APPLY_GRAYSCALE_TINT = 'applyGrayscaleTint';

const FAKE_COLOR = 10;
const R_INDEX = 0;
const G_INDEX = 1;
const B_INDEX = 2;

let fakeClampedArray: Uint8ClampedArray;

const COLOR_OPPOSITE = Color.MAX_COLOR - FAKE_COLOR;

describe('ImageManager', () => {
  beforeEach(() => {
    fakeClampedArray = {
      length: 4,
      0: 10, // fake R color index
      1: 10, // fake G color index
      2: 10  // fake B color index
    } as unknown as Uint8ClampedArray;
  });

  it('applyFilter should call filter', () => {
    spyOn(ImageManager, INVERT_FILTER_PATTERN);

    ImageManager.applyFilter(fakeClampedArray, ImageManager.invertFilterPattern);

    expect(ImageManager.invertFilterPattern).toHaveBeenCalled();
  });

  it('applyGrayscaleTint should call grayscaleFilterPattern', () => {
    spyOn(ImageManager, GRAYSCALE_FILTER_PATTERN);

    ImageManager.applyGrayscaleTint(fakeClampedArray, 0, 0);

    expect(ImageManager.grayscaleFilterPattern).toHaveBeenCalled();
  });

  it('invertFilterPattern should invert all pixel colors', () => {
    ImageManager.invertFilterPattern(fakeClampedArray, 0);

    expect(fakeClampedArray[0]).toBe(COLOR_OPPOSITE);
  });

  it('brightnessIncreaseFilterPattern should increase the brightness', () => {
    const previousR = fakeClampedArray[R_INDEX];
    const previousG = fakeClampedArray[G_INDEX];
    const previousB = fakeClampedArray[B_INDEX];

    ImageManager.brightnessIncreaseFilterPattern(fakeClampedArray, 0);

    expect(fakeClampedArray[R_INDEX]).toBeGreaterThan(previousR);
    expect(fakeClampedArray[G_INDEX]).toBeGreaterThan(previousG);
    expect(fakeClampedArray[B_INDEX]).toBeGreaterThan(previousB);
  });

  it('brightnessDecreaseFilterPattern should decrease the brightness', () => {
    const previousR = fakeClampedArray[R_INDEX];
    const previousG = fakeClampedArray[G_INDEX];
    const previousB = fakeClampedArray[B_INDEX];

    ImageManager.brightnessDecreaseFilterPattern(fakeClampedArray, 0);

    expect(fakeClampedArray[R_INDEX]).toBeLessThan(previousR);
    expect(fakeClampedArray[G_INDEX]).toBeLessThan(previousG);
    expect(fakeClampedArray[B_INDEX]).toBeLessThan(previousB);
  });

  it('grayscaleFilterPattern should make rgb values equal', () => {
    ImageManager.grayscaleFilterPattern(fakeClampedArray, 0);

    expect(fakeClampedArray[R_INDEX]).toEqual(fakeClampedArray[G_INDEX]);
    expect(fakeClampedArray[G_INDEX]).toEqual(fakeClampedArray[B_INDEX]);
  });

  it('redTintGrayscaleFilterPattern should call applyGrayscaleTint', () => {
    spyOn(ImageManager, APPLY_GRAYSCALE_TINT);

    ImageManager.redTintGrayscaleFilterPattern(fakeClampedArray, 0);

    expect(ImageManager.applyGrayscaleTint).toHaveBeenCalled();
  });

  it('greenTintGrayscaleFilterPattern should call applyGrayscaleTint', () => {
    spyOn(ImageManager, APPLY_GRAYSCALE_TINT);

    ImageManager.greenTintGrayscaleFilterPattern(fakeClampedArray, 0);

    expect(ImageManager.applyGrayscaleTint).toHaveBeenCalled();
  });

  it('blueTintGrayscaleFilterPattern should call applyGrayscaleTint', () => {
    spyOn(ImageManager, APPLY_GRAYSCALE_TINT);

    ImageManager.blueTintGrayscaleFilterPattern(fakeClampedArray, 0);

    expect(ImageManager.applyGrayscaleTint).toHaveBeenCalled();
  });
});
