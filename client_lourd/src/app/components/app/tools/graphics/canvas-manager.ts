import { Callback } from '../../callback-factory/callback';
import { CANVAS_CTX, HEIGHT_ATTRIBUTE, OCTET_DATA, WIDTH_ATTRIBUTE } from './graphics-constants';
import { FORMATS } from './graphics-factory/format-factory';
import { FilterCallback, GraphicFormat, IDimensions } from './graphics-types';
import { ImageManager } from './image-manager';

export class CanvasManager {
  static drawImageData(imgData: string, canvas: HTMLCanvasElement, resizeDimensions?: IDimensions, ...callbacks: Callback[]): void {
    const ctx = canvas.getContext(CANVAS_CTX);
    const img = new Image();
    img.onload = () => {
      if (ctx) {
        if (resizeDimensions) {
          ctx.drawImage(img, 0, 0, resizeDimensions.width, resizeDimensions.height);
        } else {
          ctx.drawImage(img, 0, 0);
        }
      }
      callbacks.forEach((callback: Callback) => callback.call());
    };
    img.src = imgData;
  }

  static getUrl(canvas: HTMLCanvasElement, format: GraphicFormat): string {
    return canvas.toDataURL(FORMATS[format]).replace(FORMATS[format], OCTET_DATA);
  }

  static resize(canvas: HTMLCanvasElement, newDimensions: IDimensions): void {
    canvas.height = newDimensions.height;
    canvas.width = newDimensions.width;
  }

  static applyFilter(canvas: HTMLCanvasElement, filterCallback: FilterCallback): void {
    const ctx = canvas.getContext(CANVAS_CTX);
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ImageManager.applyFilter(imgData.data, filterCallback);
      ctx.putImageData(imgData, 0, 0);
    }
  }

  static getDimensions(canvas: HTMLCanvasElement): IDimensions {
    const height = canvas.getAttribute(HEIGHT_ATTRIBUTE);
    const width = canvas.getAttribute(WIDTH_ATTRIBUTE);

    if (height && width) {
      return {width: +width, height: +height};
    }

    return {width: 0, height: 0};
  }
}
