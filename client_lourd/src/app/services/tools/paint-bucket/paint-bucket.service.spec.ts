import { TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { IDimensions } from 'src/app/components/app/tools/graphics/graphics-types';
import { SvgManager } from 'src/app/components/app/tools/graphics/svg-manager';
import { PaintBucketService } from './paint-bucket.service';

const colorComparator = 'colorComparator';
const ctx = 'ctx';
const getColor = 'getColor';
const checkedPosition = 'checkedPosition';
const pixelToChange = 'pixelToChange';
const dimensions = 'dimensions';
const resetArrays = 'resetArrays';
const ifPixelExist = 'ifPixelExist';
const validColor = 'validColor';
const inDrawing = 'inDrawing';
const validPixel = 'validPixel';
const floodFill = 'floodFill';
const getAllBorderPixel = 'getAllBorderPixel';
const pathDrawingService = 'pathDrawingService';
const renderer = 'renderer';
const findNextPixel = 'findNextPixel';
const getForm = 'getForm';
const getExteriorPixel = 'getExteriorPixel';
const getAllForms = 'getAllForms';
const getPathString = 'getPathString';
const createPath = 'createPath';
const createGContainer = 'createGContainer';
const createMask = 'createMask';
const makeid = 'makeid';
const createReturnPath = 'createReturnPath';
const onMouseDownInElement = 'onMouseDownInElement';
const canvas = 'canvas';
const svgService = 'svgService';

const VISIBLE = 255;
const WHITE_NUMBER = 255;
const MAX_VALUE = 255;
const BLACK = new Color(0, 0, 0, VISIBLE);
const WHITE = new Color(WHITE_NUMBER, WHITE_NUMBER, WHITE_NUMBER, VISIBLE);
const MOCK_IMAGE_DATA = {data: [WHITE_NUMBER, WHITE_NUMBER, WHITE_NUMBER, VISIBLE]} as unknown as ImageData;
const MIN_LENGHT = 4;
const TIMES_CALLED_3 = 3;
const TIMES_CALLED_4 = 4;
const TIMES_CALLED_5 = 5;

class MockRenderer2 {
  appendChild(): void {
    return;
  }
  setAttribute(): void {
    return;
  }
  createElement(): void {
    return;
  }
}

// tslint:disable-next-line: max-classes-per-file --> To be able to test every function
class MockCTX {
  getImageData(): ImageData {
    return MOCK_IMAGE_DATA;
  }
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void {
    return;
  }
}

// tslint:disable-next-line: max-classes-per-file --> To be able to test every function
class MockCANVAS {
  getContext2D(): CanvasRenderingContext2D {
    return new MockCTX() as unknown as CanvasRenderingContext2D;
  }
}

describe('PaintBucketService', () => {
  let service: PaintBucketService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(PaintBucketService);
    service[renderer] = new MockRenderer2() as unknown as Renderer2;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // this.svgService.svgSubject.subscribe
  it('svgService.svgSubject.subscribe should call function', () => {
    const SVG_STRING_B64 = 'asddsadsa';
    service[canvas] = new MockCANVAS() as unknown as HTMLCanvasElement;

    spyOn(SvgManager, 'getDimensions');
    spyOn(SvgManager, 'getB64').and.returnValue(SVG_STRING_B64);

    service[svgService].svgSubject.next(null as unknown as SVGPathElement);

    expect(SvgManager.getDimensions).toHaveBeenCalledTimes(1);
    expect(SvgManager.getB64).toHaveBeenCalledTimes(1);
  });

  // onMouseDownInElement
  it('onMouseDownInElement should be created', () => {
    const ACCEPTED_TOLERANCE = 50;
    const mockMouseDown = new MouseEvent('onMouseDownInElement');
    const path = {} as SVGPathElement;
    path.setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, resetArrays);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, getColor);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, getAllBorderPixel);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, createReturnPath).and.returnValue(path);

    service[onMouseDownInElement](mockMouseDown, ACCEPTED_TOLERANCE);

    expect(service[resetArrays]).toHaveBeenCalledTimes(1);
    expect(service[getColor]).toHaveBeenCalledTimes(1);
    expect(service[getAllBorderPixel]).toHaveBeenCalledTimes(1);
    expect(service[createReturnPath]).toHaveBeenCalledTimes(1);
  });

  // createReturnPath
  it('createReturnPath should call all of it function', () => {
    const FORMS = [[], [], []];
    service[renderer] = new MockRenderer2() as unknown as Renderer2;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, getAllForms).and.returnValue(FORMS);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, createMask);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, createPath);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[renderer], 'appendChild');
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, createGContainer);

    service[createReturnPath]();

    expect(service[renderer].appendChild).toHaveBeenCalledTimes(TIMES_CALLED_5);
    expect(service[createPath]).toHaveBeenCalledTimes(TIMES_CALLED_4);
  });

  // makeid
  it('makeid should retrun en entered lenght', () => {
    const LENGHT_WANTED = 6;

    const returnValue = service[makeid](LENGHT_WANTED);

    expect(returnValue.length).toEqual(LENGHT_WANTED);
  });

  // createMask
  it('createMask should be created', () => {
    const ID = 'dsasda';
    service[renderer] = new MockRenderer2() as unknown as Renderer2;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[renderer], 'createElement');
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[renderer], 'setAttribute');

    service[createMask](ID);

    expect(service[renderer].createElement).toHaveBeenCalledTimes(1);
    expect(service[renderer].setAttribute).toHaveBeenCalledTimes(1);
  });

  // createGContainer
  it('createGContainer should be created', () => {
    service[renderer] = new MockRenderer2() as unknown as Renderer2;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[renderer], 'createElement');
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[renderer], 'setAttribute');

    service[createGContainer]();

    expect(service[renderer].createElement).toHaveBeenCalledTimes(1);
    expect(service[renderer].setAttribute).toHaveBeenCalledTimes(1);
  });

  // createPath
  it('createPath should call its functions', () => {
    const pixelContainer: IDimensions[] = [];
    service[renderer] = new MockRenderer2() as unknown as Renderer2;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[renderer], 'createElement');
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, getPathString);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[pathDrawingService], 'setPathString');
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[renderer], 'setAttribute');

    service[createPath](pixelContainer, null, null);

    expect(service[renderer].createElement).toHaveBeenCalledTimes(1);
    expect(service[getPathString]).toHaveBeenCalledTimes(1);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(1);
    expect(service[renderer].setAttribute).toHaveBeenCalledTimes(0);
  });

  it('createPath should call its functions', () => {
    const pixelContainer: IDimensions[] = [];
    const FILL = 'blue';
    const ID = 'dasasd';
    service[renderer] = new MockRenderer2() as unknown as Renderer2;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[renderer], 'createElement');
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, getPathString);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[pathDrawingService], 'setPathString');
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[renderer], 'setAttribute');

    service[createPath](pixelContainer, FILL, ID);

    expect(service[renderer].createElement).toHaveBeenCalledTimes(1);
    expect(service[getPathString]).toHaveBeenCalledTimes(1);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(1);
    expect(service[renderer].setAttribute).toHaveBeenCalledTimes(2);
  });

  // getPathString
  it('getPathString should call all of its functions', () => {
    const A_PIXEL = {width: 0, height: 0};
    const A_SECOND_PIXEL = {width: 1, height: 0};
    const A_THIRD_PIXEL = {width: 1, height: 1};
    const pixelContainer = [];
    pixelContainer.push(A_PIXEL);
    pixelContainer.push(A_SECOND_PIXEL);
    pixelContainer.push(A_THIRD_PIXEL);

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[pathDrawingService], 'initializePathString');
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service[pathDrawingService], 'lineCreatorString');

    service[getPathString](pixelContainer);

    expect(service[pathDrawingService].initializePathString).toHaveBeenCalledTimes(1);
    expect(service[pathDrawingService].lineCreatorString).toHaveBeenCalledTimes(TIMES_CALLED_3);
  });

  // getAllForms
  it('getAllForms should return an array of lenght 1', () => {
    const A_PIXEL = {width: 0, height: 0};
    const A_SECOND_PIXEL = {width: 1, height: 0};
    const A_THIRD_PIXEL = {width: 1, height: 1};
    service[pixelToChange] = [];
    service[pixelToChange].push(A_THIRD_PIXEL);
    service[pixelToChange].push(A_SECOND_PIXEL);
    service[pixelToChange].push(A_PIXEL);

    const returnValue = service[getAllForms]();

    expect(returnValue.length).toEqual(1);
  });

  it('getAllForms should return an array of lenght 1', () => {
    const A_PIXEL = {width: 0, height: 0};
    const A_SECOND_PIXEL = {width: 1, height: 0};
    const A_THIRD_PIXEL = {width: 1, height: 1};
    const PIXEL_5 = 5;
    service[pixelToChange] = [];
    service[pixelToChange].push(A_THIRD_PIXEL);
    service[pixelToChange].push(A_SECOND_PIXEL);
    service[pixelToChange].push(A_PIXEL);
    for (let i = 0; i < MIN_LENGHT; i++) {
      service[pixelToChange].push({width: PIXEL_5 + i, height: PIXEL_5 + i});
    }

    const returnValue = service[getAllForms]();

    expect(returnValue.length).toEqual(1);
  });

  it('getAllForms should return an array of lenght 2', () => {
    const A_PIXEL = {width: 0, height: 0};
    const A_SECOND_PIXEL = {width: 1, height: 0};
    const A_THIRD_PIXEL = {width: 1, height: 1};
    const PIXEL_5 = 5;
    const MORE_THAN_MIN = MIN_LENGHT + 2;
    service[pixelToChange] = [];
    service[pixelToChange].push(A_THIRD_PIXEL);
    service[pixelToChange].push(A_SECOND_PIXEL);
    service[pixelToChange].push(A_PIXEL);
    for (let i = 0; i < MORE_THAN_MIN; i++) {
      service[pixelToChange].push({width: PIXEL_5 + i, height: PIXEL_5 + i});
    }

    const returnValue = service[getAllForms]();

    expect(returnValue.length).toEqual(2);
  });

  // getExteriorPixel
  it('getExteriorPixel should return smallest pixel', () => {
    const A_PIXEL = {width: 0, height: 0};
    const A_SECOND_PIXEL = {width: 1, height: 0};
    const A_THIRD_PIXEL = {width: 1, height: 1};
    const pixelContainer = [];
    pixelContainer.push(A_THIRD_PIXEL);
    pixelContainer.push(A_SECOND_PIXEL);
    pixelContainer.push(A_PIXEL);

    service[pixelToChange] = pixelContainer;

    const returnValue = service[getExteriorPixel]();

    expect(returnValue).toEqual(A_PIXEL);
  });

  // getFrom
  it('getFrom should add all pixel to return array', () => {
    const A_PIXEL = {width: 0, height: 0};
    const A_SECOND_PIXEL = {width: 1, height: 0};
    const A_THIRD_PIXEL = {width: 1, height: 1};
    const pixelContainer = [];
    pixelContainer.push(A_PIXEL);
    pixelContainer.push(A_SECOND_PIXEL);
    pixelContainer.push(A_THIRD_PIXEL);
    const pixelContainerLenght = pixelContainer.length;

    service[pixelToChange] = pixelContainer;

    const returnValue = service[getForm](A_PIXEL);

    expect(returnValue.length).toEqual(pixelContainerLenght);

  });

  it('getFrom should break', () => {
    const A_PIXEL = {width: 0, height: 0};
    const A_SECOND_PIXEL = {width: 1, height: 0};
    const A_THIRD_PIXEL = {width: 1, height: 1};
    const pixelContainer = [];
    pixelContainer.push(A_PIXEL);
    pixelContainer.push(A_SECOND_PIXEL);
    pixelContainer.push(A_THIRD_PIXEL);
    const pixelContainerLenght = 1;

    service[pixelToChange] = pixelContainer;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, findNextPixel).and.returnValue(null);

    const returnValue = service[getForm](A_PIXEL);

    expect(returnValue.length).toEqual(pixelContainerLenght);
    expect(service[findNextPixel]).toHaveBeenCalledTimes(1);
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from pathDrawingService', () => {
    spyOn(service[pathDrawingService], 'initializeRenderer');
    spyOn(service[renderer], 'createElement');

    service.initializeRenderer(service[renderer]);

    expect(service[pathDrawingService].initializeRenderer).toHaveBeenCalled();
    expect(service[renderer].createElement).toHaveBeenCalled();
  });

  // findNextPixel
  it('findNextPixel should return a pixel', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const PIXEL = {width: A_WIDTH, height: A_HEIGHT};

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, ifPixelExist).and.returnValue(PIXEL);

    const returnvalue = service[findNextPixel](PIXEL);

    expect(returnvalue).toEqual(PIXEL);
  });

  it('findNextPixel should return null', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const PIXEL = {width: A_WIDTH, height: A_HEIGHT};

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, ifPixelExist).and.returnValue(null as unknown as IDimensions);

    const returnvalue = service[findNextPixel](PIXEL);

    expect(returnvalue).toEqual(null as unknown as IDimensions);
  });

  // ifPixelExist
  it('ifPixelExist should find a the pixel and deleted it from pixelToChange', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const A_PIXEL = {width: A_WIDTH, height: A_HEIGHT};

    service[pixelToChange] = [];
    service[pixelToChange].push(A_PIXEL);
    const PIXEL_TO_CHANGE_LENGHT = service[pixelToChange].length;

    const returnedPixel = service[ifPixelExist](A_PIXEL);

    expect(returnedPixel).toEqual(A_PIXEL);
    expect(service[pixelToChange].length).toEqual(PIXEL_TO_CHANGE_LENGHT - 1);
  });

  it('ifPixelExist should return null if no pixel exist', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const A_PIXEL = {width: A_WIDTH, height: A_HEIGHT};

    service[pixelToChange] = [];

    const returnedPixel = service[ifPixelExist](A_PIXEL);

    expect(returnedPixel).toEqual(null as unknown as IDimensions);
  });

  // getAllBorderPixel
  it('should call floodFill 1', () => {
    const ACCEPTED_TOLERANCE = 50;
    const mockMouseDown = new MouseEvent('onMouseDownInElement');

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, floodFill);

    service[getAllBorderPixel](mockMouseDown, ACCEPTED_TOLERANCE);

    expect(service[floodFill]).toHaveBeenCalledTimes(1);
  });

  it('should call floodFill 1', () => {
    const ACCEPTED_TOLERANCE = 50;
    const mockMouseDown = new MouseEvent('onMouseDownInElement');

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, floodFill).and.callFake((x: number, y: number, acceptedTolerance: number, pixelToVerifie: IDimensions[]) => {
      pixelToVerifie.push(undefined as unknown as IDimensions);
    });

    service[getAllBorderPixel](mockMouseDown, ACCEPTED_TOLERANCE);

    expect(service[floodFill]).toHaveBeenCalledTimes(1);
  });

  // floodFill
  it('floodFill should not add to pixel to pixelToChange', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const VALID_WIDTH = 25;
    const VALID_HEIGHT = 50;
    const ACCEPTED_TOLERANCE = 50;
    const PIXEL_TO_VERIFY: IDimensions[] = [];

    service[dimensions] = {width: A_WIDTH, height: A_HEIGHT};
    service[resetArrays]();
    const PIXEL_TO_CHANGE_LENGHT = service[pixelToChange].length;
    service[checkedPosition][VALID_WIDTH + 1][VALID_HEIGHT] = 1;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, validPixel).and.returnValue(true);

    service[floodFill](VALID_WIDTH, VALID_HEIGHT, ACCEPTED_TOLERANCE, PIXEL_TO_VERIFY);

    expect(service[pixelToChange].length).toEqual(PIXEL_TO_CHANGE_LENGHT);
  });

  it('floodFill should add to pixel to pixelToChange', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const VALID_WIDTH = 50;
    const VALID_HEIGHT = 50;
    const ACCEPTED_TOLERANCE = 50;
    const PIXEL_TO_VERIFY: IDimensions[] = [];

    service[dimensions] = {width: A_WIDTH, height: A_HEIGHT};
    service[resetArrays]();
    const PIXEL_TO_CHANGE_LENGHT = service[pixelToChange].length;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, validColor).and.returnValue(true);

    service[floodFill](VALID_WIDTH, VALID_HEIGHT, ACCEPTED_TOLERANCE, PIXEL_TO_VERIFY);

    expect(service[pixelToChange].length).toEqual(PIXEL_TO_CHANGE_LENGHT + 1);
  });

  it('floodFill should add to 4 to pixelToverifie', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const VALID_WIDTH = 25;
    const VALID_HEIGHT = 50;
    const ACCEPTED_TOLERANCE = 50;
    const PIXEL_TO_VERIFY: IDimensions[] = [];
    const PIXEL_TO_VERIFY_LENGHT = PIXEL_TO_VERIFY.length;
    const NUMBER_OF_ADDED_POINT = 4;

    service[dimensions] = {width: A_WIDTH, height: A_HEIGHT};
    service[resetArrays]();

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, validColor).and.returnValue(true);

    service[floodFill](VALID_WIDTH, VALID_HEIGHT, ACCEPTED_TOLERANCE, PIXEL_TO_VERIFY);

    expect(PIXEL_TO_VERIFY.length).toEqual(PIXEL_TO_VERIFY_LENGHT + NUMBER_OF_ADDED_POINT);
  });

  // validPixel
  it('validPixel should return true', () => {
    const ACCEPTED_TOLERANCE = 50;
    const A_WIDTH = 50;
    const A_HEIGHT = 100;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, inDrawing).and.returnValue(true);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, validColor).and.returnValue(true);

    const returnValue = service[validPixel](A_WIDTH, A_HEIGHT, ACCEPTED_TOLERANCE);

    expect(returnValue).toEqual(true);
  });

  it('validPixel should return false', () => {
    const ACCEPTED_TOLERANCE = 50;
    const A_WIDTH = 50;
    const A_HEIGHT = 100;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, inDrawing).and.returnValue(false);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, validColor).and.returnValue(true);

    const returnValue = service[validPixel](A_WIDTH, A_HEIGHT, ACCEPTED_TOLERANCE);

    expect(returnValue).toEqual(false);
  });

  it('validPixel should return false', () => {
    const ACCEPTED_TOLERANCE = 50;
    const A_WIDTH = 50;
    const A_HEIGHT = 100;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, inDrawing).and.returnValue(true);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, validColor).and.returnValue(false);

    const returnValue = service[validPixel](A_WIDTH, A_HEIGHT, ACCEPTED_TOLERANCE);

    expect(returnValue).toEqual(false);
  });

  // validColor
  it('validColor should return true because the color is accepted', () => {
    const ACCEPTED_TOLERANCE = 50;
    const COLOR_COMPARATEUR_RETURN_TOLERANCE_ACCEPTED = 25;
    const A_WIDTH = 50;
    const A_HEIGHT = 100;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, colorComparator).and.returnValue(COLOR_COMPARATEUR_RETURN_TOLERANCE_ACCEPTED);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, getColor);

    const returnValue = service[validColor](A_WIDTH, A_HEIGHT, ACCEPTED_TOLERANCE);

    expect(returnValue).toEqual(true);
  });

  // inDrawing
  it('inDrawing should be true', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const VALID_WIDTH = 25;
    const VALID_HEIGHT = 50;

    service[dimensions] = {width: A_WIDTH, height: A_HEIGHT};

    const returnValue = service[inDrawing](VALID_WIDTH, VALID_HEIGHT);

    expect(returnValue).toEqual(true);
  });

  it('inDrawing should be false because of width', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const INVALID_WIDTH = 75;
    const VALID_HEIGHT = 50;

    service[dimensions] = {width: A_WIDTH, height: A_HEIGHT};

    const returnValue = service[inDrawing](INVALID_WIDTH, VALID_HEIGHT);

    expect(returnValue).toEqual(false);
  });

  it('inDrawing should be false because of height', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;
    const VALID_WIDTH = 25;
    const INVALID_HEIGHT = 150;

    service[dimensions] = {width: A_WIDTH, height: A_HEIGHT};

    const returnValue = service[inDrawing](VALID_WIDTH, INVALID_HEIGHT);

    expect(returnValue).toEqual(false);
  });

  it('validColor should return false because the color is rejected', () => {
    const ACCEPTED_TOLERANCE = 50;
    const COLOR_COMPARATEUR_RETURN_TOLERANCE_REJECTED = 75;
    const A_WIDTH = 50;
    const A_HEIGHT = 100;

    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, colorComparator).and.returnValue(COLOR_COMPARATEUR_RETURN_TOLERANCE_REJECTED);
    // tslint:disable-next-line: no-any -> To be able to test private function
    spyOn<any>(service, getColor);

    const returnValue = service[validColor](A_WIDTH, A_HEIGHT, ACCEPTED_TOLERANCE);

    expect(returnValue).toEqual(false);
  });

  // resetArrays
  it('resetArrays should have set new arrays with right height and width all to  0', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;

    service[dimensions] = {width: A_WIDTH, height: A_HEIGHT};

    service[resetArrays]();

    for (let i = 0; i < A_WIDTH; i++) {
      for (let j = 0; j < A_HEIGHT; j++) {
        expect(service[checkedPosition][i][j]).toEqual(0);
      }
    }

  });

  it('resetArrays should have set pixelToChange to empty array', () => {
    const A_WIDTH = 50;
    const A_HEIGHT = 100;

    service[dimensions] = {width: A_WIDTH, height: A_HEIGHT};

    service[resetArrays]();

    expect(service[pixelToChange]).toEqual([]);

  });

  // getColor
  it('getColor should return color from ctx', () => {
    const returnColor = new Color(WHITE_NUMBER, WHITE_NUMBER, WHITE_NUMBER, VISIBLE / MAX_VALUE);

    service[ctx] = new MockCTX() as unknown as CanvasRenderingContext2D;

    const returnValue = service[getColor](0 , 0);

    expect(returnValue.strFormat).toEqual(returnColor.strFormat);
  });

  // colorComparator
  it('colorComparator should return 0', () => {
    const ZERO_PERCENT = 0;
    const returnValue = service[colorComparator](BLACK, BLACK);

    expect(returnValue).toEqual(ZERO_PERCENT);
  });

  it('colorComparator should return 100', () => {
    const SAME_COLOR = 100;
    const returnValue = service[colorComparator](WHITE, BLACK);

    expect(returnValue).toEqual(SAME_COLOR);
  });

  it('colorComparator should return positive', () => {
    const RANDOM_COLOR1 = 10;
    const RANDOM_COLOR2 = 50;
    const COLOR1 = new Color(RANDOM_COLOR1, RANDOM_COLOR1, RANDOM_COLOR1, VISIBLE);
    const COLOR2 = new Color(RANDOM_COLOR2, RANDOM_COLOR2, RANDOM_COLOR2, VISIBLE);
    const returnValue = service[colorComparator](COLOR1, COLOR2 );

    expect(returnValue).toBeGreaterThan(0);
  });

  it('colorComparator should return positive', () => {
    const RANDOM_COLOR1 = 10;
    const RANDOM_COLOR2 = 50;
    const COLOR2 = new Color(RANDOM_COLOR1, RANDOM_COLOR1, RANDOM_COLOR1, VISIBLE);
    const COLOR1 = new Color(RANDOM_COLOR2, RANDOM_COLOR2, RANDOM_COLOR2, VISIBLE);
    const returnValue = service[colorComparator](COLOR1, COLOR2);

    expect(returnValue).toBeGreaterThan(0);
  });

// tslint:disable-next-line: max-file-line-count -> to be able to test everyting
});
