import {
  JPG_EXTENSION,
  PNG_EXTENSION,
  SVG_EXTENSION
} from '../graphics-constants';

import {
  GraphicFormat,
  IGraphicFormatToExtensionMap
} from '../graphics-types';

export const EXTENSIONS: IGraphicFormatToExtensionMap = {};
EXTENSIONS[GraphicFormat.SVG] = SVG_EXTENSION;
EXTENSIONS[GraphicFormat.PNG] = PNG_EXTENSION;
EXTENSIONS[GraphicFormat.JPG] = JPG_EXTENSION;
