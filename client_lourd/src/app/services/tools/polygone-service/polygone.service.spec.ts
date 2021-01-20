import { Renderer2 } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { PolygoneComponent } from 'src/app/components/app/tools/shapeTools/polygone/polygone/polygone.component';
import { Position } from 'src/app/models/position';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { DrawingSizeService } from '../../drawing/drawing-size.service';
import { GallerieDrawingService } from '../../gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from '../../svg-service/svg.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';
import { PolygoneService } from './polygone.service';

const RENDERER = 'renderer';
const IS_DRAWING = 'isDrawing';
const IS_IN_ELEMENT = 'isInElement';
const PATH = 'path';
const SHAPE_PATH = 'shapePath';
const PERIMETER_PATH = 'perimeterPath';
const INITIAL_POSITION = 'initialPosition';
const CURRENT_POSITION = 'currentPosition';
const DRAW_SHAPE = 'drawShape';
const NUMBER_OF_SIDES = 5;
const eraserService = 'eraserService';
const ADD_PATH = 'addPath';
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

describe('Service: Polygone', () => {
  let service: PolygoneService;
  const pathDrawingService = 'pathDrawingService';
  const mockMouseDown = new MouseEvent('mousedown');
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const mockPolygone = new PolygoneComponent(new PolygoneService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing),
                       new EraserService( new PathDrawingService(),
                                          new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));
  const mockMove = new MouseEvent('mousemove');
  const path: SVGPathElement = {} as SVGPathElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PolygoneService]
    });
    service = TestBed.get(PolygoneService);
    service[RENDERER] = TestBed.get(Renderer2);
  });

  it('should ...', inject([PolygoneService], () => {
    expect(service).toBeTruthy();
  }));

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

    service.onMouseDown(mockMouseDown, mockPolygone, mockColor, mockColor);

    expect(service[IS_DRAWING]).toBe(true);
    expect(service[INITIAL_POSITION]).toBe(initialPositionMock);
    expect(service[CURRENT_POSITION]).toBe(currentPositionMock);
  });

  // onMouseDown()
  it("onMouseDown should if polygone type is contour change fillColor to none and lineSize to polygone's line size", () => {
    service[IS_DRAWING] = true;
    service[IS_IN_ELEMENT] = true;
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(service[RENDERER], 'appendChild').and.returnValue();
    spyOn(service[RENDERER], 'createElement');
    spyOn(service[pathDrawingService], 'setPathString').and.returnValue();
    spyOn(service[pathDrawingService], 'setBasicAttributes').and.returnValue();
    spyOn(service[pathDrawingService], 'setPerimeterAttributes').and.returnValue();

    mockPolygone.shapeType = 'Contour';
    service.onMouseDown(mockMouseDown, mockPolygone, mockColor, mockColor);

    mockPolygone.shapeType = 'Plein';
    service.onMouseDown(mockMouseDown, mockPolygone, mockColor, mockColor);

    service[IS_IN_ELEMENT] = false;
    try {
      service.onMouseDown(mockMouseDown, mockPolygone, mockColor, mockColor);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseDownInElement()
  it("onMouseDown should if polygone type is contour change fillColor to none and lineSize to polygone's line size", () => {
    service[IS_IN_ELEMENT] = false;
    const returnedValue = service.onMouseDownInElement();
    expect(returnedValue).toBe(service[PATH]);
    expect(service[IS_IN_ELEMENT]).toBe(true);
  });

  // onMouseUp()
  it('onMouseUp should reset isDrawing and perimeterPathString', () => {
    spyOn(service[pathDrawingService], 'setPathString').and.returnValue();
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

  // drawShape()
  it('drawShape should call drawPolygone() from PathDrawingService and path is shapePath', () => {
    service[SHAPE_PATH] = path;
    spyOn(service[pathDrawingService], 'drawPolygone').and.returnValue(path);

    service[DRAW_SHAPE](path, NUMBER_OF_SIDES);
    expect(service[pathDrawingService].drawPolygone).toHaveBeenCalled();
  });

   // drawShape()
  it('drawShape should call drawRectangle() from PathDrawingService and path is perimeterPath', () => {
    service[PERIMETER_PATH] = path;
    spyOn(service[pathDrawingService], 'drawRectangle').and.returnValue(path);

    service[DRAW_SHAPE](path, NUMBER_OF_SIDES);
    expect(service[pathDrawingService].drawRectangle).toHaveBeenCalled();
  });

  // onMouseMove()
  it('onMouseMove should call drawSquare() and drawPerimeter() if isDrawing is true and isSquareActivated is true', () => {
    service[IS_DRAWING] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawShape').and.returnValue(path);
    spyOn(service[RENDERER], 'appendChild').and.callFake((parent, child) => {
      expect(parent).toBe(service[PATH]);
      expect(child).toBe(path);
    });

    service[IS_DRAWING] = true;

    service.onMouseMove(mockMove, NUMBER_OF_SIDES);
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
      service.onMouseMove(mockMove, NUMBER_OF_SIDES);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }

    service[IS_DRAWING] = true;

    service.onMouseMove(mockMove, NUMBER_OF_SIDES);
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
