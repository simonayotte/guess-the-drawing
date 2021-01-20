import { Renderer2 } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { EllipseComponent } from 'src/app/components/app/tools/shapeTools/ellipse/ellipse/ellipse.component';
import { Position } from 'src/app/models/position';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { DrawingSizeService } from '../../drawing/drawing-size.service';
import { GallerieDrawingService } from '../../gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from '../../svg-service/svg.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';
import { EllipseService } from './ellipse.service';

const RENDERER = 'renderer';
const IS_DRAWING = 'isDrawing';
const CIRCLE_IS_ACTIVATED = 'circleIsActivated';
const IS_IN_ELEMENT = 'isInElement';
const PATH = 'path';
const SHAPE_PATH = 'shapePath';
const PERIMETER_PATH = 'perimeterPath';
const INITIAL_POSITION = 'initialPosition';
const CURRENT_POSITION = 'currentPosition';
const DRAW_SHAPE = 'drawShape';
const eraserService = 'eraserService';
const ADD_PATH = 'addPath';
const MERGE_PATHS = 'mergePaths';
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';

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

describe('Service: Ellipse', () => {
  let service: EllipseService;
  const pathDrawingService = 'pathDrawingService';
  const mockMouseDown = new MouseEvent('mousedown');
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const mockEllipse = new EllipseComponent(new EllipseService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing),
  new EraserService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));
  const mockMove = new MouseEvent('mousemove');
  const path: SVGPathElement = {} as SVGPathElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EllipseService]
    });
    service = TestBed.get(EllipseService);
    service[RENDERER] = TestBed.get(Renderer2);
  });

  it('should ...', inject([EllipseService], () => {
    expect(service).toBeTruthy();
  }));

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from pathDrawingService', () => {
    spyOn(service[pathDrawingService], 'initializeRenderer');
    service.initializeRenderer(service[RENDERER]);

    expect(service[pathDrawingService].initializeRenderer).toHaveBeenCalled();
    });

   // onMouseDownInElement()
  it("onMouseDown should if ellipse type is contour change fillColor to none and lineSize to ellipse's line size", () => {
    service[IS_IN_ELEMENT] = false;
    const returnedValue = service.onMouseDownInElement();
    expect(returnedValue).toBe(service[PATH]);
    expect(service[IS_IN_ELEMENT]).toBe(true);
  });

  // onMouseDown()
  it('onMouseDown should change the values of the positions, set is drawing to true', () => {
    const initialPositionMock = new Position(0, 0);
    const currentPositionMock = new Position(0, 0);
    service[IS_IN_ELEMENT] = true;
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(service[RENDERER], 'appendChild').and.returnValue();
    spyOn(service[RENDERER], 'createElement');
    spyOn(service[pathDrawingService], 'setPathString').and.returnValue();
    spyOn(service[pathDrawingService], 'setBasicAttributes').and.returnValue();
    spyOn(service[pathDrawingService], 'setPerimeterAttributes').and.returnValue();

    service[IS_DRAWING] = false;
    service[INITIAL_POSITION] = initialPositionMock;
    service[CURRENT_POSITION] = currentPositionMock;

    service.onMouseDown(mockMouseDown, mockEllipse, mockColor, mockColor);

    expect(service[IS_DRAWING]).toBe(true);
    expect(service[INITIAL_POSITION]).toBe(initialPositionMock);
    expect(service[CURRENT_POSITION]).toBe(currentPositionMock);

    service[IS_IN_ELEMENT] = false;
    try {
      service.onMouseDown(mockMouseDown, mockEllipse, mockColor, mockColor);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseDown()
  it("onMouseDown should if ellipse type is contour change fillColor to none and lineSize to ellipse's line size", () => {
    service[IS_DRAWING] = true;
    service[IS_IN_ELEMENT] = true;
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(service[RENDERER], 'appendChild').and.returnValue();
    spyOn(service[RENDERER], 'createElement');
    spyOn(service[pathDrawingService], 'setPathString').and.returnValue();
    spyOn(service[pathDrawingService], 'setBasicAttributes').and.returnValue();
    spyOn(service[pathDrawingService], 'setPerimeterAttributes').and.returnValue();

    mockEllipse.shapeType = 'Contour';
    service.onMouseDown(mockMouseDown, mockEllipse, mockColor, mockColor);

    mockEllipse.shapeType = 'Plein';
    service.onMouseDown(mockMouseDown, mockEllipse, mockColor, mockColor);

    service[IS_IN_ELEMENT] = false;
    try {
      service.onMouseDown(mockMouseDown, mockEllipse, mockColor, mockColor);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseUp()
  it('onMouseUp should reset isDrawing and perimeterPathString', () => {
    const mockPath = jasmine.createSpyObj('shapePath', ['setAttribute']);
    service[SHAPE_PATH] = mockPath;
    spyOn(service [pathDrawingService], 'setPathString').and.returnValue();
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service[IS_IN_ELEMENT] = false;
    service[IS_DRAWING] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[eraserService], ADD_PATH);

    try {
      service.onMouseUp();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }

    service[IS_IN_ELEMENT] = true;
    service.onMouseUp();
    expect(service[IS_DRAWING]).toBe(false);
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

   // onShiftDown()
  it('onShiftDown should call drawCircle() and drawPerimeter() if isDrawing is true and square should activate', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawShape').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergePaths');

    service[CIRCLE_IS_ACTIVATED] = false;
    service[IS_DRAWING] = false;

    try {
      service.onShiftDown();
      expect(0).toBe(1);
    } catch (error) {
      expect(1).toBe(1);
    }
    service[IS_DRAWING] = true;

    service.onShiftDown();
    expect(service[CIRCLE_IS_ACTIVATED]).toBe(true);
    expect(service[DRAW_SHAPE]).toHaveBeenCalled();
    expect(service[MERGE_PATHS]).toHaveBeenCalled();
  });

  // onShiftUp()
  it('onShiftUp should call drawEllipse() and drawPerimeter() if isDrawing is true and square should desactivate', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawShape').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergePaths');

    service[CIRCLE_IS_ACTIVATED] = true;
    service[IS_DRAWING] = false;

    try {
      service.onShiftUp();
      expect(0).toBe(1);
    } catch (error) {
      expect(1).toBe(1);
    }

    service[IS_DRAWING] = true;

    service.onShiftUp();
    expect(service[CIRCLE_IS_ACTIVATED]).toBe(false);
    expect(service[DRAW_SHAPE]).toHaveBeenCalled();
    expect(service[MERGE_PATHS]).toHaveBeenCalled();
  });

  // drawShape()
  it('drawShape should call drawCircle() from PathDrawingService and path is shapePath', () => {
    service[CIRCLE_IS_ACTIVATED] = true;
    service[PERIMETER_PATH] = path;
    spyOn(service[pathDrawingService], 'drawCircle').and.returnValue(path);
    spyOn(service[pathDrawingService], 'drawRectangle').and.returnValue(path);

    service[DRAW_SHAPE](path);
    expect(service[pathDrawingService].drawRectangle).toHaveBeenCalled();

    service[SHAPE_PATH] = path;
    service[DRAW_SHAPE](path);
    expect(service[pathDrawingService].drawCircle).toHaveBeenCalled();
  });

   // drawShape()
  it('drawShape should call drawEllipse() from PathDrawingService and path is perimeterPath', () => {
    service[CIRCLE_IS_ACTIVATED] = false;
    service[PERIMETER_PATH] = path;
    spyOn(service[pathDrawingService], 'drawEllipse').and.returnValue(path);
    spyOn(service[pathDrawingService], 'drawRectangle').and.returnValue(path);

    service[DRAW_SHAPE](path);
    expect(service[pathDrawingService].drawRectangle).toHaveBeenCalled();

    service[SHAPE_PATH] = path;
    service[DRAW_SHAPE](path);
    expect(service[pathDrawingService].drawEllipse).toHaveBeenCalled();
  });

  // onMouseMove()
  it('onMouseMove should call drawCircle() and drawPerimeter() if isDrawing is true and circleIsActivated is true', () => {
    service[IS_DRAWING] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawShape').and.returnValue(path);
    spyOn(service[RENDERER], 'appendChild').and.callFake((parent, child) => {
      expect(parent).toBe(service[PATH]);
      expect(child).toBe(path);
    });

    service[IS_DRAWING] = true;

    service.onMouseMove(mockMove);
    expect(service[DRAW_SHAPE]).toHaveBeenCalled();
    expect(service[RENDERER].appendChild).toHaveBeenCalledTimes(2);
  });

  it('onMouseMove should call drawSHAPE if isDrawing is true and throw an error if false', () => {
    spyOn(service[RENDERER], 'appendChild').and.returnValue();
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawShape').and.returnValue(path);
    service[IS_DRAWING] = false;

    try {
      service.onMouseMove(mockMove);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }

    service[IS_DRAWING] = true;

    service.onMouseMove(mockMove);
    expect(service[DRAW_SHAPE]).toHaveBeenCalled();
  });

  // onMouseLeave()
  it('onMouseLeave should call appendChild from renderer 2 times and throw an error if false', () => {
    spyOn(service[RENDERER], 'appendChild').and.returnValue();

    service[IS_DRAWING] = false;
    try {
      service.onMouseLeave();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }

    service[IS_DRAWING] = true;
    service.onMouseLeave();
    expect(service[RENDERER].appendChild).toHaveBeenCalledTimes(2);
  });

  // onMouseEnter()
  it('onMouseEnter should call appendChild from renderer 2 times and throw an error if false', () => {
    service[IS_DRAWING] = false;
    spyOn(service[RENDERER], 'appendChild').and.returnValue();

    try {
      service.onMouseEnter();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
    service[IS_DRAWING] = true;
    service.onMouseEnter();
    expect(service[RENDERER].appendChild).toHaveBeenCalledTimes(2);
  });

});
