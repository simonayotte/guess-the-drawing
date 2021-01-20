// Supported formats
export enum GraphicFormat {
  SVG,
  PNG,
  JPG
}

// Supported filters
export enum Filter {
  NONE = 'none',
  GRAYSCALE = 'grayscale',
  INVERTED = 'invert',
  HIGH_BRIGHTNESS = 'brightnessIncrease',
  LOW_BRIGHTNESS = 'brightnessDecrease',
  OPACITY = 'opacity'
}

// Mapping of API Format enum to format data
export interface IGraphicFormatToFormatNameMap {
  [graphicFormat: number]: string;
}

// Mapping of API Filter enum to filter callback
export interface IImageFilterToFilterCallback {
  [imageFilter: number]: FilterCallback;
}

export interface IDimensions {
  width: number;
  height: number;
  depth?: number;
}

// Mapping of API enum to extensions
export interface IGraphicFormatToExtensionMap {
  [graphicFormat: number]: string;
}

export interface IGraphicFormatToDatatypeMap {
  [graphicFormat: number]: string;
}
// Supported html elements
export type OutputCallback = (element: HTMLElement | SVGElement, format: GraphicFormat) => string;

// Image filter callback
export type FilterCallback = (colorData: Uint8ClampedArray, clampedPixelDataIndex: number) => void;
