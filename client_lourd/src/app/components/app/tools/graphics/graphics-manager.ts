import { Callback } from '../../callback-factory/callback';
import { CanvasManager } from './canvas-manager';
import { UrlFactory } from './graphics-factory/url-factory';
import { GraphicFormat, IDimensions } from './graphics-types';
import { SvgManager } from './svg-manager';

export class GraphicsManager {
  getUrl(obj: HTMLElement | SVGElement, format: GraphicFormat): string {
    const method = UrlFactory.getUrlMethod(obj);
    return method(obj, format);
  }

  svgToCanvas(sourceSvg: SVGElement, targetCanvas: HTMLCanvasElement, resizeToSvg: boolean, ...callbacks: Callback[]): void {
    const imgData = SvgManager.getB64(sourceSvg);
    if (resizeToSvg) {
      const dimensions = SvgManager.getDimensions(sourceSvg);
      const resizeDimensions = {width: dimensions.width, height: dimensions.height};
      this.svg64BtoCanvas(imgData, targetCanvas, resizeDimensions, ...callbacks);
    } else {
      this.svg64BtoCanvas(imgData, targetCanvas, undefined, ...callbacks);
    }
  }

  svg64BtoCanvas(svg64B: string, targetCanvas: HTMLCanvasElement, resizeToSvgDimensions?: IDimensions, ...callbacks: Callback[]): void {
    if (resizeToSvgDimensions) {
      CanvasManager.resize(targetCanvas, resizeToSvgDimensions);
      CanvasManager.drawImageData(svg64B, targetCanvas, undefined, ...callbacks);
    } else {
      CanvasManager.drawImageData(svg64B, targetCanvas, CanvasManager.getDimensions(targetCanvas), ...callbacks);
    }
  }
}
