import { IDimensions } from './graphics-types';

const data = 'data:';
const image = 'image/';
const SVG_XML = 'svg+xml';

export const SVG_IMAGE_DATA = image + SVG_XML;
export const SVG_METADATA = data + SVG_IMAGE_DATA;
export const B64_SVG_METADATA = SVG_METADATA + ';base64,';
export const PNG_METADATA = image + 'png';
export const JPG_METADATA = image + 'jpeg';
export const OCTET_DATA = 'octet/stream';
export const CANVAS_CTX = '2d';
export const SVG_EXTENSION = 'svg';
export const PNG_EXTENSION = 'png';
export const JPG_EXTENSION = 'jpg';
export const SVG_VIEW = 'SVG';
export const PNG_VIEW = 'PNG';
export const JPG_VIEW = 'JPG';

export const CANVAS_DEFAULT_DIMENSIONS: IDimensions = {width: 300, height: 300};

export const R_CLAMPED_INDEX = 0;
export const G_CLAMPED_INDEX = 1;
export const B_CLAMPED_INDEX = 2;
export const R_GRAYSCALE_FACTOR = 0.2126;
export const G_GRAYSCALE_FACTOR = 0.7152;
export const B_GRAYSCALE_FACTOR = 0.0722;
export const TINT_FACTOR = 1.3;

export const NONE_VIEW = 'Aucun';
export const GRAYSCALE_VIEW = 'Gris nuancé';
export const INVERTED_VIEW = 'Couleurs inversées';
export const HIGH_BRIGHTNESS_VIEW = 'Luminosité élevée';
export const LOW_BRIGHTNESS_VIEW = 'Luminosité faible';
export const OPACITY_VIEW = 'Opacité réduite';

export const PERCENT = 100;
export const BRIGHTNESS_FACTOR = 20;
export const IMAGE_DATA_STEP = 4;

export const FILTER_ATTRIBUTE = 'filter';
export const WIDTH_ATTRIBUTE = 'width';
export const HEIGHT_ATTRIBUTE = 'height';
export const STYLE_ATTRIBUTE = 'style';
