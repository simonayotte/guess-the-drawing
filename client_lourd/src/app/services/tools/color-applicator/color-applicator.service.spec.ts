import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { ColorApplicatorService } from './color-applicator.service';

const RENDERER = 'renderer';
const CHANGE_G_ELEMENT_COLOR = 'changeGElementColor';
const CHANGE_PATH_MAIN_COLOR = 'changePathMainColor';
const CHANGE_SHAPE_COLOR = 'changeShapeColor';
const FIND_TYPE_OF_TARGET = 'findTypeOfTarget';
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';

describe('ColorApplicatorService', () => {
  let service: ColorApplicatorService;
  const mockColor = new Color( 0, 0, 0, 0);
  const mockMouseEvent = new MouseEvent('onMouseDown');
  const mockPath: SVGPathElement = {} as SVGPathElement;
  const mockGElement: SVGGElement = {} as SVGGElement;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach( () => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ColorApplicatorService);
    service[RENDERER] = TestBed.get(Renderer2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initializeRenderer should set the value of the current renderer to the one passed in parameter', () => {
    const mockRenderer = service[RENDERER];
    service.initializeRenderer(mockRenderer);
    expect(service[RENDERER]).toBe(mockRenderer);
  });

  it('changeGelementColor should change the stroke and fill color by calling setAttribute two times', () => {
    spyOn(service[RENDERER], 'setAttribute');
    service[CHANGE_G_ELEMENT_COLOR](mockGElement, mockColor);
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(2);
  });

  it('changePathMainColor should change the stroke color by calling setAttribute', () => {
    spyOn(service[RENDERER], 'setAttribute');
    service[CHANGE_PATH_MAIN_COLOR](mockPath, mockColor);
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(1);
  });

  it('changeShapeColor should change the color only if the old color is not none by calling get/setAttribute once', () => {
    const path = jasmine.createSpyObj('path', ['getAttribute']);
    path.getAttribute.and.returnValue('red');
    spyOn(service[RENDERER], 'setAttribute');
    service[CHANGE_SHAPE_COLOR](path, mockColor, 'stroke');
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(1);
    expect(path.getAttribute).toHaveBeenCalledTimes(1);
  });

  it('changeShapeColor should not change the color only if the old color is none by calling setAttribute zero time', () => {
    const path = jasmine.createSpyObj('path', ['getAttribute']);
    path.getAttribute.and.returnValue('none');
    spyOn(service[RENDERER], 'setAttribute');
    service[CHANGE_SHAPE_COLOR](path, mockColor, 'stroke');
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(0);
    expect(path.getAttribute).toHaveBeenCalledTimes(1);
  });

  it('onRightMouseDownInElement should not call findTypeOfTarget if the target of the event is null', () => {
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(null);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'findTypeOfTarget');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service.onRightMouseDownInElement(mockMouseEvent, mockColor);
    expect(service[FIND_TYPE_OF_TARGET]).toHaveBeenCalledTimes(0);
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('onRightMouseDownInElement should call changeShapeColor if the target is a shape', () => {
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'findTypeOfTarget').and.returnValue('shape');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CHANGE_SHAPE_COLOR);
    service.onRightMouseDownInElement(mockMouseEvent, mockColor);
    expect(service[CHANGE_SHAPE_COLOR]).toHaveBeenCalledTimes(1);
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('onRightMouseDownInElement should not call changeShapeColor if the target of the event is not a shape', () => {
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'findTypeOfTarget').and.returnValue('PATH');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CHANGE_SHAPE_COLOR);
    service.onRightMouseDownInElement(mockMouseEvent, mockColor);
    expect(service[CHANGE_SHAPE_COLOR]).toHaveBeenCalledTimes(0);
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('findTypeOfTarget should return svg if the target is the svg', () => {
    const path: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(mockMouseEvent.target, 'parentElement').and.returnValue(null);
    expect(service[FIND_TYPE_OF_TARGET](mockMouseEvent)).toEqual('svg');
  });

  it('findTypeOfTarget should return gElement if the target parent is a gElement', () => {
    const path: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(mockMouseEvent.target, 'parentElement').and.returnValue(path);
    expect(service[FIND_TYPE_OF_TARGET](mockMouseEvent)).toEqual('gElement');
  });

  it('findTypeOfTarget should return drawingPath if the target is a path with no id', () => {
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(mockMouseEvent.target, 'parentElement').and.returnValue(path);
    expect(service[FIND_TYPE_OF_TARGET](mockMouseEvent)).toEqual('drawingPath');
  });

  it('findTypeOfTarget should return drawingPath if the target is a path with no id', () => {
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    spyOn(path, 'getAttribute').and.returnValue('id');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(mockMouseEvent.target, 'parentElement').and.returnValue(path);
    expect(service[FIND_TYPE_OF_TARGET](mockMouseEvent)).toEqual('shape');
  });

  it('onMouseDownInElement should not call findTypeOfTarget if the target is null', () => {
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(null);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'findTypeOfTarget');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service.onMouseDownInElement(mockMouseEvent, mockColor);
    expect(service[FIND_TYPE_OF_TARGET]).toHaveBeenCalledTimes(0);
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('onMouseDownInElement should call changeShapeColor if findTypeOfTarget shape', () => {
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'findTypeOfTarget').and.returnValue('shape');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CHANGE_SHAPE_COLOR);
    service.onMouseDownInElement(mockMouseEvent, mockColor);
    expect(service[FIND_TYPE_OF_TARGET]).toHaveBeenCalledTimes(1);
    expect(service[CHANGE_SHAPE_COLOR]).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('onMouseDownInElement should call changePathMainColor if findTypeOfTarget return drawingPath', () => {
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'findTypeOfTarget').and.returnValue('drawingPath');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CHANGE_PATH_MAIN_COLOR);
    service.onMouseDownInElement(mockMouseEvent, mockColor);
    expect(service[FIND_TYPE_OF_TARGET]).toHaveBeenCalledTimes(1);
    expect(service[CHANGE_PATH_MAIN_COLOR]).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('onMouseDownInElement should call changeGElementColor if findTypeOfTarget return gElement and the parent is not undefined', () => {
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(path, 'parentElement').and.returnValue(mockPath);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'findTypeOfTarget').and.returnValue('gElement');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CHANGE_G_ELEMENT_COLOR);
    service.onMouseDownInElement(mockMouseEvent, mockColor);
    expect(service[FIND_TYPE_OF_TARGET]).toHaveBeenCalledTimes(1);
    expect(service[CHANGE_G_ELEMENT_COLOR]).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('onMouseDownInElement should not call changeGElementColor if findTypeOfTarget return gElement and the parent not undefined', () => {
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(path, 'parentElement').and.returnValue(undefined);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'findTypeOfTarget').and.returnValue('gElement');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CHANGE_G_ELEMENT_COLOR);
    service.onMouseDownInElement(mockMouseEvent, mockColor);
    expect(service[FIND_TYPE_OF_TARGET]).toHaveBeenCalledTimes(1);
    expect(service[CHANGE_G_ELEMENT_COLOR]).toHaveBeenCalledTimes(0);
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });
});
