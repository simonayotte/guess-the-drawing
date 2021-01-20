import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RectangleToolComponent } from 'src/app/components/app/tools/shapeTools/rectangle-tool/rectangle-tool.component';
import { Position } from 'src/app/models/position';
import { Color } from '../../../components/app/tools/color-picker/color';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { DrawingSizeService } from '../../drawing/drawing-size.service';
import { GallerieDrawingService } from '../../gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from '../../svg-service/svg.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';
import { RectangleService } from './rectangle.service';

const RENDERER = 'renderer';
const IS_DRAWING = 'isDrawing';
const IS_IN_ELEMENT = 'isInElement';
const SQUARE_IS_ACTIVATED = 'squareIsActivated';
const PATH = 'path';
const SHAPE_PATH = 'shapePath';
const INITIAL_POSITION = 'initialPosition';
const CURRENT_POSITION = 'currentPosition';
const DRAW_SHAPE = 'drawShape';
const eraserService = 'eraserService';
const ADD_PATH = 'addPath';
const MERGE_PATHS = 'mergePaths';
const INITIALIZE_SHAPEPATH = 'initializeShapePath';
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

describe('RectangleService', () => {
  let service: RectangleService;
  const pathDrawingService = 'pathDrawingService';
  const mockMouseDown = new MouseEvent('mousedown');
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const mockRectangle = new RectangleToolComponent(
    new RectangleService(
      new PathDrawingService(),
      new CommandInvokerService(mockContinueDrawing),
      new EraserService(
        new PathDrawingService(), new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));

  const mockMove = new MouseEvent('mousemove');
  const path: SVGPathElement = {} as SVGPathElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RectangleService] });
    service = TestBed.get(RectangleService);
    service[RENDERER] = TestBed.get(Renderer2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from pathDrawingService', () => {
    spyOn(service[pathDrawingService], 'initializeRenderer');
    service.initializeRenderer(service[RENDERER]);

    expect(service[pathDrawingService].initializeRenderer).toHaveBeenCalled();
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

    service.onMouseDown(mockMouseDown, mockRectangle, mockColor, mockColor);

    expect(service[IS_DRAWING]).toBe(true);
    expect(service[INITIAL_POSITION]).toBe(initialPositionMock);
    expect(service[CURRENT_POSITION]).toBe(currentPositionMock);

    service[IS_IN_ELEMENT] = false;
    try {
      service.onMouseDown(mockMouseDown, mockRectangle, mockColor, mockColor);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseDownInElement()
  it("onMouseDown should if rectangle type is contour change fillColor to none and lineSize to rectangle's line size", () => {
    service[IS_IN_ELEMENT] = false;
    const returnedValue = service.onMouseDownInElement();
    expect(returnedValue).toBe(service[PATH]);
    expect(service[IS_IN_ELEMENT]).toBe(true);
  });

  // initializeShapePath()
  it('initializeShapePath should initialized the path of rectangle', () => {
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(service[RENDERER], 'createElement');
    spyOn(service[pathDrawingService], 'setPathString');
    spyOn(service[pathDrawingService], 'setBasicAttributes');
    spyOn(service[pathDrawingService], 'initializePathString');

    mockRectangle.shapeType = 'Contour';
    service[INITIALIZE_SHAPEPATH](mockMouseDown, mockRectangle, mockColor, mockColor);
    mockRectangle.shapeType = 'Plein';
    service[INITIALIZE_SHAPEPATH](mockMouseDown, mockRectangle, mockColor, mockColor);
    expect(service[RENDERER].createElement).toHaveBeenCalled();
    expect(service[pathDrawingService].setPathString).toHaveBeenCalled();
    expect(service[pathDrawingService].setBasicAttributes).toHaveBeenCalled();
    expect(service[pathDrawingService].initializePathString).toHaveBeenCalled();
  });

  // onMouseUp()
  it('onMouseUp should reset isDrawing and perimeterPathString', () => {
    spyOn(service [pathDrawingService], 'setPathString').and.returnValue();
    const mockPath = jasmine.createSpyObj('shapePath', ['setAttribute']);
    service[SHAPE_PATH] = mockPath;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[eraserService], ADD_PATH);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service[IS_IN_ELEMENT] = false;
    service[IS_DRAWING] = true;

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
  it('onShiftDown should call drawSquare() and drawPerimeter() if isDrawing is true and square should activate', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawShape').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergePaths');

    service[SQUARE_IS_ACTIVATED] = false;
    service[IS_DRAWING] = false;

    try {
      service.onShiftDown();
      expect(0).toBe(1);
    } catch (error) {
      expect(1).toBe(1);
    }
    service[IS_DRAWING] = true;

    service.onShiftDown();
    expect(service[SQUARE_IS_ACTIVATED]).toBe(true);
    expect(service[DRAW_SHAPE]).toHaveBeenCalled();
    expect(service[MERGE_PATHS]).toHaveBeenCalled();
  });

  // onShiftUp()
  it('onShiftUp should call drawRectangle() and drawPerimeter() if isDrawing is true and square should desactivate', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawShape').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergePaths');

    service[SQUARE_IS_ACTIVATED] = true;
    service[IS_DRAWING] = false;

    try {
      service.onShiftUp();
      expect(0).toBe(1);
    } catch (error) {
      expect(1).toBe(1);
    }

    service[IS_DRAWING] = true;

    service.onShiftUp();
    expect(service[SQUARE_IS_ACTIVATED]).toBe(false);
    expect(service[DRAW_SHAPE]).toHaveBeenCalled();
    expect(service[MERGE_PATHS]).toHaveBeenCalled();
  });

  // drawShape()
  it('drawShape should call drawSquare() from PathDrawingService if squareIsActivated and path is shapePath', () => {
    service[SQUARE_IS_ACTIVATED] = true;
    service[SHAPE_PATH] = path;
    spyOn(service[pathDrawingService], 'drawSquare').and.returnValue(path);

    service[DRAW_SHAPE](path);
    expect(service[pathDrawingService].drawSquare).toHaveBeenCalled();
  });

  // drawShape()
  it('drawShape should call drawRectangle() from PathDrawingService if squareIsActivated is false or path is not shapePath', () => {
    service[SQUARE_IS_ACTIVATED] = false;
    spyOn(service[pathDrawingService], 'drawRectangle').and.returnValue(path);

    service[DRAW_SHAPE](path);
    expect(service[pathDrawingService].drawRectangle).toHaveBeenCalled();
  });

  // onMouseMove()
  it('onMouseMove should call drawSquare() and drawPerimeter() if isDrawing is true and isSquareActivated is true', () => {
    service[IS_DRAWING] = true;
    service[SQUARE_IS_ACTIVATED] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawShape').and.returnValue(path);
    spyOn(service[RENDERER], 'appendChild').and.callFake((parent, child) => {
      expect(parent).toBe(service[PATH]);
      expect(child).toBe(path);
    });

    service[IS_DRAWING] = true;
    service[SQUARE_IS_ACTIVATED] = true;

    service.onMouseMove(mockMove);
    expect(service[DRAW_SHAPE]).toHaveBeenCalled();
    expect(service[RENDERER].appendChild).toHaveBeenCalledTimes(2);
  });

  it('onMouseMove should call drawRectangle() and drawPerimeter() if isDrawing is true and isSquareActivated is false', () => {
    spyOn(service[RENDERER], 'appendChild').and.returnValue();
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawShape').and.returnValue(path);
    service[SQUARE_IS_ACTIVATED] = false;
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
  it('onMouseLeave should call appendChild from renderer 2 times', () => {
    service[IS_DRAWING] = true;
    spyOn(service[RENDERER], 'appendChild').and.returnValue();

    service.onMouseLeave();
    expect(service[RENDERER].appendChild).toHaveBeenCalledTimes(2);
  });

  // onMouseEnter()
  it('onMouseEnter should call appendChild from renderer 2 times', () => {
    service[IS_DRAWING] = true;
    spyOn(service[RENDERER], 'appendChild').and.returnValue();

    service.onMouseEnter();
    expect(service[RENDERER].appendChild).toHaveBeenCalledTimes(2);
  });

  it('if the user is not drawing, it should not return any path and return an error', () => {
    service[IS_DRAWING] = false;
    try {
      service.onMouseLeave();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
    try {
      service.onMouseEnter();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });
});
