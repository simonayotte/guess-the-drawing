import { B64_SVG_METADATA,
         FILTER_ATTRIBUTE,
         HEIGHT_ATTRIBUTE,
         STYLE_ATTRIBUTE,
         WIDTH_ATTRIBUTE } from './graphics-constants';
import { FORMATS } from './graphics-factory/format-factory';
import { GraphicFormat, IDimensions } from './graphics-types';

export class SvgManager {
  static getB64(svg: SVGElement): string {
    const svgXml = SvgManager.getString(svg);
    return B64_SVG_METADATA + btoa(svgXml);
  }

  static getString(svg: SVGElement): string {
    return new XMLSerializer().serializeToString(svg);
  }

  static getStringFromB64(svg64BString: string): string {
    svg64BString = svg64BString.slice(B64_SVG_METADATA.length);
    return atob(svg64BString);
  }

  static getUrl(svg: SVGElement): string {
      const xml = SvgManager.getString(svg);
      return FORMATS[GraphicFormat.SVG] + encodeURIComponent(xml);
  }

  static getAspectRatio(svg: SVGElement): IDimensions {
    const multipliers: IDimensions = {width: 1, height: 1};
    const dimensions = SvgManager.getDimensions(svg);

    if (dimensions) {
      if (dimensions.width > dimensions.height) {
        multipliers.height = dimensions.height / dimensions.width;
      } else {
        multipliers.width = dimensions.width / dimensions.height;
      }
    }
    return multipliers;
  }

  static fromString(svgString: string): SVGElement {
    const parser = new DOMParser();
    return parser.parseFromString(svgString, 'image/svg+xml').documentElement as unknown as SVGElement;
  }

  static fromB64Str(svg64BString: string): SVGElement {
    const str = SvgManager.getStringFromB64(svg64BString);
    return SvgManager.fromString(str);
  }

  static clone(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
  }

  static resize(svg: SVGElement, newDimensions: IDimensions): void {
    svg.setAttribute(WIDTH_ATTRIBUTE, newDimensions.width.toString());
    svg.setAttribute(HEIGHT_ATTRIBUTE, newDimensions.height.toString());
  }

  static setFilter(svg: SVGElement, filterId: string): void {
    svg.setAttribute(FILTER_ATTRIBUTE, 'url(#' + filterId + ')');
  }

  static getDimensions(svg: SVGElement): IDimensions {
    const width = svg.getAttribute(WIDTH_ATTRIBUTE);
    const height = svg.getAttribute(HEIGHT_ATTRIBUTE);

    if (height && width) {
      return {width: +width, height: +height};
    }

    return {width: 0, height : 0};
  }

  static setHidden(svg: SVGElement, hidden: boolean): void {
    svg.style.display = hidden ? 'none' : 'block';
  }

  static setStyle(svg: SVGElement, style: string): void {
    svg.setAttribute(STYLE_ATTRIBUTE, style);
  }
}
