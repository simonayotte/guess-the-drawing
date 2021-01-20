import {
  JPG_METADATA,
  PNG_METADATA,
  SVG_METADATA,
} from '../graphics-constants';

import {
  GraphicFormat,
  IGraphicFormatToFormatNameMap,
} from '../graphics-types';

// custom API for supported formats, mapping api enum to format data
export const FORMATS: IGraphicFormatToFormatNameMap = {};
FORMATS[GraphicFormat.SVG] = SVG_METADATA + ';charset=utf-8,';
FORMATS[GraphicFormat.PNG] = PNG_METADATA;
FORMATS[GraphicFormat.JPG] = JPG_METADATA;
