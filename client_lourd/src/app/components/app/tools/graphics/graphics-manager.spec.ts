import { CanvasManager } from './canvas-manager';
import { UrlFactory } from './graphics-factory/url-factory';
import { GraphicsManager } from './graphics-manager';
import { GraphicFormat, IDimensions, OutputCallback } from './graphics-types';
import { SvgManager } from './svg-manager';

const FAKE_SVG = {
  // fake element
} as unknown as SVGElement;

const fakeFunction = () => {
  // do nothing
};

const FAKE_CANVAS = {
  getBoundingClientRect: () => {
    // do nothing
  }
} as unknown as HTMLCanvasElement;

const GET_URL_METHOD = 'getUrlMethod';
const FAKE_STR = 'fake string';
const FAKE_DIMENSIONS = { width: 5, height: 5 } as unknown as IDimensions;
const SVG_64B_TO_CANVAS = 'svg64BtoCanvas';
const GET_B64 = 'getB64';
const RESIZE = 'resize';
const DRAW_IMAGE_DATA = 'drawImageData';
const GET_DIMENSIONS = 'getDimensions';

describe('GraphicsManager', () => {
  let manager: GraphicsManager;

  beforeEach(() => {
    manager = new GraphicsManager();
  });

  it('getUrl should return getUrl from SvgManager on an svg element', () => {
    const spy = spyOn(UrlFactory, GET_URL_METHOD).and.returnValue(fakeFunction as unknown as OutputCallback);

    manager.getUrl(FAKE_SVG, GraphicFormat.SVG);

    expect(spy).toHaveBeenCalled();
  });

  it('svgToCanvas should call svg64BtoCanvas without resizing', () => {
    const spyGet = spyOn(SvgManager, GET_B64);
    const spySvg64b = spyOn(manager, SVG_64B_TO_CANVAS);

    manager.svgToCanvas(FAKE_SVG, FAKE_CANVAS, false);

    expect(spyGet).toHaveBeenCalled();
    expect(spySvg64b).toHaveBeenCalled();
  });

  it('svgToCanvas should call svg64BtoCanvas with resizing', () => {
    const spyb64 = spyOn(SvgManager, GET_B64);
    const spyDimensions = spyOn(SvgManager, GET_DIMENSIONS).and.returnValue(FAKE_DIMENSIONS);
    const spySvg64b = spyOn(manager, SVG_64B_TO_CANVAS);

    manager.svgToCanvas(FAKE_SVG, FAKE_CANVAS, true);

    expect(spyb64).toHaveBeenCalled();
    expect(spyDimensions).toHaveBeenCalled();
    expect(spySvg64b).toHaveBeenCalled();
  });

  it('svg64BtoCanvas should not resize the canvas and call drawImageData', () => {
    const spyDimensions = spyOn(CanvasManager, GET_DIMENSIONS);
    const spyResize = spyOn(CanvasManager, RESIZE);
    const spyImageData = spyOn(CanvasManager, DRAW_IMAGE_DATA);

    manager.svg64BtoCanvas(FAKE_STR, FAKE_CANVAS);

    expect(spyDimensions).toHaveBeenCalled();
    expect(spyResize).toHaveBeenCalledTimes(0);
    expect(spyImageData).toHaveBeenCalled();
  });

  it('svg64BtoCanvas should resize the canvas and call drawImageData', () => {
    const spyResize = spyOn(CanvasManager, RESIZE);
    const spyImageData = spyOn(CanvasManager, DRAW_IMAGE_DATA);

    manager.svg64BtoCanvas(FAKE_STR, FAKE_CANVAS, FAKE_DIMENSIONS);

    expect(spyResize).toHaveBeenCalled();
    expect(spyImageData).toHaveBeenCalled();
  });
});
