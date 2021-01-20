import { CanvasManager } from '../canvas-manager';
import { SvgManager } from '../svg-manager';
import { UrlFactory } from './url-factory';

const XML_NS = 'http://www.w3.org/2000/svg';
const SVG_STR = 'svg';
const CANVAS = 'canvas';
const UNKNOWN = 'unknown';

describe('UrlFactory', () => {

  it('getUrlMethod should return getUrl from CanvasManager on a canvas object', () => {
    const canvas = document.createElement(CANVAS);

    const returnValue = UrlFactory.getUrlMethod(canvas);

    expect(returnValue).toBe(CanvasManager.getUrl);
  });

  it('getUrlMethod should return getUrl from SvgManager on an Svg object', () => {
    const svg = document.createElementNS(XML_NS, SVG_STR);

    const returnValue = UrlFactory.getUrlMethod(svg);

    expect(returnValue).toBe(SvgManager.getUrl);
  });

  it('getUrlMethod should return getUrl from SvgManager on an unknown html element', () => {
    const unknown = document.createElement(UNKNOWN);

    const returnValue = UrlFactory.getUrlMethod(unknown);

    expect(returnValue).toBe(SvgManager.getUrl);
  });
});
