import { CanvasManager } from './canvas-manager';
import { GraphicFormat, IDimensions } from './graphics-types';
import { ImageManager } from './image-manager';

const GET_CONTEXT = 'getContext';
const TO_DATA_URL = 'toDataURL';
const GET_IMG_DATA = 'getImageData';
const PUT_IMG_DATA = 'putImageData';
const APPLY_FILTER = 'applyFilter';
const GET_ATTRIBUTE = 'getAttribute';
const DRAW_IMAGE = 'drawImage';

const FAKE_IMG_DATA = 'imgData';
const FAKE_DATA = {
  data: FAKE_IMG_DATA
} as unknown as ImageData;
const FAKE_CANVAS = {
  getContext: () => {
    // fake function
  },
  toDataURL: () => {
    // fake function
    return 'a string';
  },
  getAttribute: () => {
    // fake function
  }
} as unknown as HTMLCanvasElement;
const FAKE_CTX = {
  drawImage: () => {
    // fake function
  },
  getImageData: () => {
    // fake function
  },
  putImageData: () => {
    // fake function
  }
} as unknown as CanvasRenderingContext2D;
const FAKE_RESIZE_DIMENSIONS = {width: 15, height: 15} as IDimensions;

describe('CanvasManager', () => {
  it('drawImageData should call drawImage', () => {
    spyOn(FAKE_CANVAS, GET_CONTEXT).and.returnValue(FAKE_CTX);

    CanvasManager.drawImageData(FAKE_IMG_DATA, FAKE_CANVAS);

    expect(FAKE_CANVAS.getContext).toHaveBeenCalled();
  });

  it('drawImageData should do nothing if ctx is not found', () => {
    spyOn(FAKE_CANVAS, GET_CONTEXT).and.returnValue(null);
    const spyDraw = spyOn(FAKE_CTX, DRAW_IMAGE);

    CanvasManager.drawImageData(FAKE_IMG_DATA, FAKE_CANVAS);

    expect(FAKE_CANVAS.getContext).toHaveBeenCalled();
    expect(spyDraw).toHaveBeenCalledTimes(0);
  });

  it('getUrl should call toDataUrl', () => {
    spyOn(FAKE_CANVAS, TO_DATA_URL).and.callThrough();

    CanvasManager.getUrl(FAKE_CANVAS, GraphicFormat.SVG);

    expect(FAKE_CANVAS.toDataURL).toHaveBeenCalled();
  });

  it('resize should set the width and height of the canvas to the new dimensions', () => {
    CanvasManager.resize(FAKE_CANVAS, FAKE_RESIZE_DIMENSIONS);

    expect(FAKE_CANVAS.width).toBe(FAKE_RESIZE_DIMENSIONS.width);
    expect(FAKE_CANVAS.height).toBe(FAKE_RESIZE_DIMENSIONS.height);
  });

  it('applyFilter should call getImageData, applyFilter from ImageManager and putImageData', () => {
    spyOn(FAKE_CANVAS, GET_CONTEXT).and.returnValue(FAKE_CTX);
    spyOn(FAKE_CTX, GET_IMG_DATA).and.returnValue(FAKE_DATA);
    spyOn(ImageManager, APPLY_FILTER);
    spyOn(FAKE_CTX, PUT_IMG_DATA);

    CanvasManager.applyFilter(FAKE_CANVAS, ImageManager.invertFilterPattern);

    expect(FAKE_CANVAS.getContext).toHaveBeenCalled();
    expect(FAKE_CTX.getImageData).toHaveBeenCalled();
    expect(ImageManager.applyFilter).toHaveBeenCalled();
    expect(FAKE_CTX.putImageData).toHaveBeenCalled();
  });

  it('applyFilter should do nothing if ctx is not found', () => {
    const spy = spyOn(FAKE_CANVAS, GET_CONTEXT).and.returnValue(null);
    const spyImg = spyOn(FAKE_CTX, GET_IMG_DATA);
    const spyPut = spyOn(FAKE_CTX, PUT_IMG_DATA);

    CanvasManager.applyFilter(FAKE_CANVAS, ImageManager.invertFilterPattern);

    expect(spy).toHaveBeenCalled();
    expect(spyImg).toHaveBeenCalledTimes(0);
    expect(spyPut).toHaveBeenCalledTimes(0);
  });

  it('getDimensions should return width and height 0 if canvas has no width and height attributes', () => {
    const spyAttr = spyOn(FAKE_CANVAS, GET_ATTRIBUTE).and.returnValue(null);

    const returnValue = CanvasManager.getDimensions(FAKE_CANVAS);

    expect(spyAttr).toHaveBeenCalledTimes(2);
    expect(returnValue).toEqual({width: 0, height: 0});
  });
});
