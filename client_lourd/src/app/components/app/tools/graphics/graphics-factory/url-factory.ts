import { CanvasManager } from '../canvas-manager';
import { OutputCallback } from '../graphics-types';
import { SvgManager } from '../svg-manager';

export class UrlFactory {
  static getUrlMethod(obj: HTMLElement | SVGElement): OutputCallback {
    let urlMethod: OutputCallback = undefined as unknown as OutputCallback;
    if (obj instanceof HTMLCanvasElement) {
      urlMethod = CanvasManager.getUrl;
    } else if (obj instanceof SVGElement || obj instanceof HTMLUnknownElement) {
      urlMethod = SvgManager.getUrl;
    }
    return urlMethod;
  }
}
