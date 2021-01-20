import { Color } from 'src/app/components/app/tools/color-picker/color';

const HEIGHT = 'height="';
const WIDTH = 'width="';
const BACKGROUND_COLOR = 'background-color';
const BACKGROUND_COLOR_LENGHT = 'background-color:rgba('.length;
const TRANSAPRENCY = 'width';
const TRANSAPRENCY_LENGHT = 3;
const SVG_BEGINNING_TAG = '>';
const SVG_CLOSING_TAG = '<';
const HEIGHT_END_SYMBOLE = '"';
const WIDTH_END_SYMBOLE = '"';
const COLOR_ENDING_SYMBOLE = ',';

export class SvgStringManipulationService {

  static deleteSvgHtmlTag = (svgString: string): string => {
    return svgString.slice(svgString.search(SVG_BEGINNING_TAG) + 1, svgString.lastIndexOf(SVG_CLOSING_TAG));
  }

  static getHeight = (svgString: string): number => {
    const intermediateString = svgString.slice(svgString.search(HEIGHT) + HEIGHT.length);
    return +intermediateString.slice(0 , intermediateString.search(HEIGHT_END_SYMBOLE));
  }

  static getWidth = (svgString: string): number => {
    let intermediateString = svgString.slice(svgString.search(WIDTH) + WIDTH.length);
    intermediateString = intermediateString.slice(intermediateString.search(WIDTH) + WIDTH.length);
    return +intermediateString.slice(0 , intermediateString.search(WIDTH_END_SYMBOLE));
  }

  static getBackGroundColor = (svgString: string): Color => {
    let intermediateString = svgString.slice(svgString.search(BACKGROUND_COLOR) + BACKGROUND_COLOR_LENGHT);
    const r: number = +intermediateString.slice(0 , intermediateString.search(COLOR_ENDING_SYMBOLE));
    intermediateString = intermediateString.slice(intermediateString.search(COLOR_ENDING_SYMBOLE) + 2);
    const g = +intermediateString.slice(0 , intermediateString.search(COLOR_ENDING_SYMBOLE));
    intermediateString = intermediateString.slice(intermediateString.search(COLOR_ENDING_SYMBOLE) + 2);
    const b = +intermediateString.slice(0 , intermediateString.search(COLOR_ENDING_SYMBOLE));
    intermediateString = intermediateString.slice(intermediateString.search(COLOR_ENDING_SYMBOLE) + 2);
    const a = +intermediateString.slice(0 , intermediateString.search(TRANSAPRENCY) - TRANSAPRENCY_LENGHT);
    return new Color(r, g, b, a);
  }

}
