import { TestBed } from '@angular/core/testing';

import { GridService } from './grid.service';

const SET_ELEMENT_WIDTH = 'setElementWidth';
const SET_ELEMENT_HEIGHT = 'setElementHeight';
const SET_GRID_PIXEL_SIZE = 'setGridPixelSize';
const GET_BOUNDED_VALUE = 'getBoundedValue';
const NEXT = 'next';
const SET_A = 'setA';
const CLONE = 'clone';
const SET_ATTRIBUTE = 'setAttribute';
const UPDATE_MAX_GRID_PIXEL_SIZE = 'updateMaxGridPixelSize';
const PATH_DRAWING_SERVICE = 'pathDrawingService';
const LINE_CREATOR_STRING = 'lineCreatorString';

const SQUARE_PATTERN_LINES = 2;

const FAKE_SVG_PATTERN = {
  setAttribute: () => {
    // do nothing
  }
} as unknown as SVGPatternElement;
const FAKE_NUMBER = 0;
const FAKE_NUMBER_2 = 10;
const FAKE_NUMBER_3 = 5;
const FAKE_LOWER_BOUND = 1;
const FAKE_UPPER_BOUND = 8;

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updatePatternDimensions should call setElementWidth and setElementHeight', () => {
    const spyWidth = spyOn(service, SET_ELEMENT_WIDTH);
    const spyHeight = spyOn(service, SET_ELEMENT_HEIGHT);

    service.updatePatternDimensions(FAKE_SVG_PATTERN);

    expect(spyWidth).toHaveBeenCalled();
    expect(spyHeight).toHaveBeenCalled();
  });

  it('incrementGridPixels should call setGridPixelSize', () => {
    const spy = spyOn(service, SET_GRID_PIXEL_SIZE);

    service.incrementGridPixels();

    expect(spy).toHaveBeenCalled();
  });

  it('decrementGridPixels should call setGridPixelSize', () => {
    const spy = spyOn(service, SET_GRID_PIXEL_SIZE);

    service.decrementGridPixels();

    expect(spy).toHaveBeenCalled();
  });

  it('setGridPixelSize should call getBoundedValue and call next on gridPixelsSubject', () => {
    const spyBounds = spyOn(service, GET_BOUNDED_VALUE);
    const spyNext = spyOn(service.gridPixelsSubject, NEXT);

    service.setGridPixelSize(FAKE_NUMBER);

    expect(spyBounds).toHaveBeenCalled();
    expect(spyNext).toHaveBeenCalled();
  });

  it('setTransparency should call setA with getBoundedValue, then next of gridColorSubject of a cloned color', () => {
    const spySetA = spyOn(service.color, SET_A);
    const spyBounds = spyOn(service, GET_BOUNDED_VALUE);
    const spyNext = spyOn(service.gridColorSubject, NEXT);
    const spyClone = spyOn(service.color, CLONE);

    service.setTransparency(FAKE_NUMBER);

    expect(spySetA).toHaveBeenCalled();
    expect(spyBounds).toHaveBeenCalled();
    expect(spyNext).toHaveBeenCalled();
    expect(spyClone).toHaveBeenCalled();
  });

  it('updateMaxGridPixelSize should call next of gridPixelsMaxSubject with gridHeight', () => {
    const spyNext = spyOn(service.gridPixelsMaxSubject, NEXT);

    service.gridHeight = FAKE_NUMBER_2;
    service.gridWidth = FAKE_NUMBER;
    service.updateMaxGridPixelSize();

    expect(spyNext).toHaveBeenCalled();
  });

  it('updateMaxGridPixelSize should call next of gridPixelsMaxSubject with gridWidth', () => {
    const spyNext = spyOn(service.gridPixelsMaxSubject, NEXT);

    service.gridHeight = FAKE_NUMBER;
    service.gridWidth = FAKE_NUMBER_2;
    service.updateMaxGridPixelSize();

    expect(spyNext).toHaveBeenCalled();
  });

  it('setElementWidth should call setAttribute of element', () => {
    const spySetAttribute = spyOn(FAKE_SVG_PATTERN, SET_ATTRIBUTE);

    service.setElementWidth(FAKE_SVG_PATTERN, FAKE_NUMBER);

    expect(spySetAttribute).toHaveBeenCalled();
  });

  it('setElementHeight should call setAttribute of element', () => {
    const spySetAttribute = spyOn(FAKE_SVG_PATTERN, SET_ATTRIBUTE);

    service.setElementHeight(FAKE_SVG_PATTERN, FAKE_NUMBER);

    expect(spySetAttribute).toHaveBeenCalled();
  });

  it('setGridWidth should call updateMaxGridPixelSize and setElementWidth and set gridWidth', () => {
    const spyUpdate = spyOn(service, UPDATE_MAX_GRID_PIXEL_SIZE);
    const spySet = spyOn(service, SET_ELEMENT_WIDTH);

    service.setGridWidth(FAKE_SVG_PATTERN, FAKE_NUMBER);

    expect(service.gridWidth).toBe(FAKE_NUMBER);
    expect(spyUpdate).toHaveBeenCalled();
    expect(spySet).toHaveBeenCalled();
  });

  it('setGridHeight should call updateMaxGridPixelSize and setElementHeight and set gridHeight', () => {
    const spyUpdate = spyOn(service, UPDATE_MAX_GRID_PIXEL_SIZE);
    const spySet = spyOn(service, SET_ELEMENT_HEIGHT);

    service.setGridHeight(FAKE_SVG_PATTERN, FAKE_NUMBER);

    expect(service.gridHeight).toBe(FAKE_NUMBER);
    expect(spyUpdate).toHaveBeenCalled();
    expect(spySet).toHaveBeenCalled();
  });

  it('getPath should call initializePathString 2 times to define a square pattern', () => {
    const spyLine = spyOn(service[PATH_DRAWING_SERVICE], LINE_CREATOR_STRING);

    service.getPath();

    expect(spyLine).toHaveBeenCalledTimes(SQUARE_PATTERN_LINES);
  });

  it('getBoundedValue should return upperBound when value is bigger than upperBound', () => {
    const returnValue = service.getBoundedValue(FAKE_NUMBER_2, FAKE_LOWER_BOUND, FAKE_UPPER_BOUND);

    expect(returnValue).toBe(FAKE_UPPER_BOUND);
  });

  it('getBoundedValue should return lowerBound when value is smaller than lowerBound', () => {
    const returnValue = service.getBoundedValue(FAKE_NUMBER, FAKE_LOWER_BOUND, FAKE_UPPER_BOUND);

    expect(returnValue).toBe(FAKE_LOWER_BOUND);
  });

  it('getBoundedValue should return value when value is between the bounds', () => {
    const returnValue = service.getBoundedValue(FAKE_NUMBER_3, FAKE_LOWER_BOUND, FAKE_UPPER_BOUND);

    expect(returnValue).toBe(FAKE_NUMBER_3);
  });

  it('getBoundedValue should return value if lowerBound is bigger than upperBound', () => {
    const returnValue = service.getBoundedValue(FAKE_NUMBER_3, FAKE_UPPER_BOUND, FAKE_LOWER_BOUND);

    expect(returnValue).toBe(FAKE_NUMBER_3);
  });

  it('setActivation should call next from gridActivationSubject', () => {
    const spy = spyOn(service.gridActivationSubject, NEXT);

    service.setActivation(true);

    expect(spy).toHaveBeenCalled();
  });
});
