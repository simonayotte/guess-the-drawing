import { JPG_METADATA, PNG_METADATA, SVG_IMAGE_DATA } from '../graphics-constants';
import { GraphicFormat, IGraphicFormatToDatatypeMap } from '../graphics-types';

export const DATATYPES: IGraphicFormatToDatatypeMap = {};
DATATYPES[GraphicFormat.SVG] = SVG_IMAGE_DATA;
DATATYPES[GraphicFormat.PNG] = PNG_METADATA;
DATATYPES[GraphicFormat.JPG] = JPG_METADATA;
