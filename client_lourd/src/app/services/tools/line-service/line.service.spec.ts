import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { LineToolComponent } from 'src/app/components/app/tools/line-tool/line-tool.component';
import { PathManipulation } from 'src/app/models/path-manipulation';
import { Position } from 'src/app/models/position';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { DrawingSizeService } from '../../drawing/drawing-size.service';
import { GallerieDrawingService } from '../../gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from '../../svg-service/svg.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';
import { LineService } from './line.service';

// Private fonctions and attributs names
const angleLine = 'angleLine';
const mesureAngle = 'mesureAngle';
const closeLoop = 'closeLoop';
const drawCircle = 'drawCircle';
const drawLine = 'drawLine';
const renderer = 'renderer';
const isInElement = 'isInElement';
const isDrawing = 'isDrawing';
const isShiftPressed = 'isShiftPressed';
const verifyPathString = 'verifyPathString';
const differenceBetweenPoints = 'getdifferenceBetweenPoints';
const drawWithPastPath = 'drawWithPastPath';
const getPastPosition = 'getPastPosition';
const pathManipulation = 'pathManipulation';
const pathLine = 'pathLine';
const getAttribute = 'getAttribute';
const setAttribute = 'setAttribute';
const setFinalePathAttributs = 'setFinalePathAttributs';
const mergePaths = 'mergePaths';
const initializeDrawing = 'initializeDrawing';
const initializePath = 'initializePath';
const initializeCirclePath = 'initializeCirclePath';
const inMouvement = 'inMouvement';
const ifLastPoint = 'ifLastPoint';
const drawCloseLoop = 'drawCloseLoop';
const drawWithCurrentPath = 'drawWithCurrentPath';
const pathContainer = 'pathContainer';
const getMouvement = 'getMouvement';
const getCurrentPosition = 'getCurrentPosition';
const getdifferenceBetweenPoints = 'getdifferenceBetweenPoints';
const getFirstPosition = 'getFirstPosition';
const deleteLastPosition = 'deleteLastPosition';
const setPathString = 'setPathString';
const whiteColorValue = 255;
const callTimes3 = 3;

const eraserService = 'eraserService';
const ADD_PATH = 'addPath';
enum svgElement {
  path = 0,
  pathLine = 1,
  pathCircle = 2,
}

// Constantes
const CURRENT_POSITION_X = 0;
const CURRENT_POSITION_Y = 0;
const LAST_POSITION_X = 50;
const LAST_POSITION_Y = 50;
const ANGLE_MINUS_45 = -45;
const ANGLE_0 = 0;
const ANGLE_45 = 45;
const ANGLE_90 = 90;
const ANGLE_135 = 135;
const POSITION_0 = 0;
const POSITION_50 = 50;
const A_STRING = 'a string';
const A_NUMBER = 5;
const ONE_POINT = 1;
const TIME_CALLED_4 = 4;
const TIME_CALLED_5 = 5;
const TIME_CALLED_8 = 8;
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

describe('LineService', () => {
  let service: LineService;
  const pathDrawingService = 'pathDrawingService';
  const mockMouseEvent = new MouseEvent('mouseEvent');
  const mockKeyboardEvent = new KeyboardEvent('keyboardEvent');
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const mockLineTool = new LineToolComponent(new LineService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing),
  new EraserService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));
  const pathSVGElement: SVGPathElement = {} as SVGPathElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LineService] });
    service = TestBed.get(LineService);
    service[renderer] = TestBed.get(Renderer2);
    service[pathManipulation] = new PathManipulation();
    service[pathContainer] = [];
    service[pathContainer][svgElement.pathLine] = pathSVGElement;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from pathDrawingService', () => {
    spyOn(service[pathDrawingService], 'initializeRenderer');
    service.initializeRenderer(service[renderer]);

    expect(service[pathDrawingService].initializeRenderer).toHaveBeenCalled();
  });

  // onMouseDownInElement()
  it('onMouseDownInElement should set isInElement to true', () => {
    service[isInElement] = false;
    service[isDrawing] = true;

    service.onMouseDownInElement();

    expect(service[isInElement]).toBe(true);
  });

  it('onMouseDownInElement should throw error', () => {
    service[isInElement] = false;
    service[isDrawing] = false;

    try {
      service.onMouseDownInElement();
      expect('to throw error').toBe('no error');
      } catch (error) {
      expect('to throw error').toBe('to throw error');
    }

    expect(service[isInElement]).toBe(true);
  });

  // onMouseDown()
  it('onMouseDown should set inMouvement to right value', () => {
    service[isInElement] = false;
    service[isDrawing] = true;
    service[inMouvement] = true;
    const color = new Color(whiteColorValue, whiteColorValue, whiteColorValue, 1);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'initializeDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'angleLine');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithPastPath');

    try {
      service.onMouseDown(mockMouseEvent, mockLineTool, color);
      expect('to throw error').toBe('no error');
      } catch (error) {
      expect('to throw error').toBe('to throw error');
    }

    expect(service[inMouvement]).toBe(true);

    service[isInElement] = true;
    service[isDrawing] = false;
    service[inMouvement] = true;

    service.onMouseDown(mockMouseEvent, mockLineTool, color);

    expect(service[inMouvement]).toBe(true);

    service[isInElement] = true;
    service[isDrawing] = true;
    service[inMouvement] = true;
    service[isShiftPressed] = true;

    service.onMouseDown(mockMouseEvent, mockLineTool, color);

    expect(service[inMouvement]).toBe(false);

    service[inMouvement] = true;
    service[isShiftPressed] = false;

    service.onMouseDown(mockMouseEvent, mockLineTool, color);

    expect(service[inMouvement]).toBe(false);
  });

  it('onMouseDown should call fonction right amount of times', () => {
    service[isInElement] = false;
    service[isDrawing] = true;
    const color = new Color(whiteColorValue, whiteColorValue, whiteColorValue, 1);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'initializeDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'angleLine');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithPastPath');

    try {
    service.onMouseDown(mockMouseEvent, mockLineTool, color);
    expect('to throw error').toBe('no error');
    } catch (error) {
    expect('to throw error').toBe('to throw error');
    }

    expect(service[initializeDrawing]).toHaveBeenCalledTimes(0);
    expect(service[angleLine]).toHaveBeenCalledTimes(0);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(0);

    service[isInElement] = true;
    service[isDrawing] = false;

    service.onMouseDown(mockMouseEvent, mockLineTool, color);

    expect(service[initializeDrawing]).toHaveBeenCalledTimes(1);
    expect(service[angleLine]).toHaveBeenCalledTimes(0);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(0);

    service[isInElement] = true;
    service[isDrawing] = true;
    service[isShiftPressed] = true;

    service.onMouseDown(mockMouseEvent, mockLineTool, color);

    expect(service[initializeDrawing]).toHaveBeenCalledTimes(1);
    expect(service[angleLine]).toHaveBeenCalledTimes(1);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(0);

    service[isShiftPressed] = false;

    service.onMouseDown(mockMouseEvent, mockLineTool, color);

    expect(service[initializeDrawing]).toHaveBeenCalledTimes(1);
    expect(service[angleLine]).toHaveBeenCalledTimes(1);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(1);
  });

  // onMouseMove()
  it('onMouseMove should set isDrawing and inMouvement to right value', () => {
    service[isDrawing] = true;
    service[inMouvement] = false;

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithCurrentPath');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'angleLine');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithPastPath');

    service.onMouseMove(mockMouseEvent, mockLineTool);

    expect(service[inMouvement]).toBeTruthy();

    service.onMouseMove(mockMouseEvent, mockLineTool);

    service[isDrawing] = true;
    service[inMouvement] = true;

    service.onMouseMove(mockMouseEvent, mockLineTool);

    expect(service[inMouvement]).toBe(true);
  });

  it('onMouseMove should set isDrawing and inMouvement to right value', () => {
    service[isDrawing] = false;
    service[inMouvement] = true;

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithCurrentPath');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'angleLine');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithPastPath');
    try {
    service.onMouseMove(mockMouseEvent, mockLineTool);
    expect('to throw error').toBe('no error');
    } catch (error) {
    expect('to throw error').toBe('to throw error');
    }

    expect(service[drawWithCurrentPath]).toHaveBeenCalledTimes(0);
    expect(service[angleLine]).toHaveBeenCalledTimes(0);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(0);

    service[isDrawing] = true;
    service[isShiftPressed] = true;

    service.onMouseMove(mockMouseEvent, mockLineTool);

    expect(service[drawWithCurrentPath]).toHaveBeenCalledTimes(0);
    expect(service[angleLine]).toHaveBeenCalledTimes(1);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(0);

    service[isShiftPressed] = false;

    service.onMouseMove(mockMouseEvent, mockLineTool);

    expect(service[drawWithCurrentPath]).toHaveBeenCalledTimes(0);
    expect(service[angleLine]).toHaveBeenCalledTimes(1);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(1);

    service[isDrawing] = true;
    service[inMouvement] = false;

    service.onMouseMove(mockMouseEvent, mockLineTool);

    expect(service[drawWithCurrentPath]).toHaveBeenCalledTimes(1);
    expect(service[angleLine]).toHaveBeenCalledTimes(1);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(1);
  });

  // onDoubleClick()
  it('onDoubleClick should call right fonction', () => {
    service[isDrawing] = false;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[eraserService], ADD_PATH);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service[pathContainer][svgElement.path] = jasmine.createSpyObj(pathLine, ['setAttribute']);
    // spyOn<any>(pathLine, 'setAttribute');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'closeLoop').and.returnValue(false);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawCloseLoop');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithPastPath');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'setFinalePathAttributs');

    service.onDoubleClick(mockMouseEvent, mockLineTool);

    expect(service[closeLoop]).toHaveBeenCalledTimes(0);
    expect(service[drawCloseLoop]).toHaveBeenCalledTimes(0);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(0);
    expect(service[setFinalePathAttributs]).toHaveBeenCalledTimes(1);
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();

    service[isDrawing] = true;

    service.onDoubleClick(mockMouseEvent, mockLineTool);

    expect(service[closeLoop]).toHaveBeenCalledTimes(1);
    expect(service[drawCloseLoop]).toHaveBeenCalledTimes(0);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(1);
    expect(service[setFinalePathAttributs]).toHaveBeenCalledTimes(2);
  });

  it('onDoubleClick should always set isDrawing and inMouvement to false', () => {
    service[isDrawing] = false;
    service[inMouvement] = true;
    service[pathContainer][svgElement.path] = jasmine.createSpyObj(pathLine, ['setAttribute']);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[eraserService], ADD_PATH);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['setAttribute']);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'closeLoop').and.returnValue(false);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawCloseLoop');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithPastPath');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'setFinalePathAttributs');

    service.onDoubleClick(mockMouseEvent, mockLineTool);

    expect(service[inMouvement]).toBe(false);
    expect(service[isDrawing]).toBe(false);

    service[isDrawing] = true;

    service.onDoubleClick(mockMouseEvent, mockLineTool);

    expect(service[inMouvement]).toBe(false);
    expect(service[isDrawing]).toBe(false);
  });

  it('onDoubleClick should have called all fonction once and set all attribut to false', () => {
    service[isDrawing] = true;
    service[inMouvement] = true;
    service[pathContainer][svgElement.path] = jasmine.createSpyObj(pathLine, ['setAttribute']);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[eraserService], ADD_PATH);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['setAttribute']);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'closeLoop').and.returnValue(true);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawCloseLoop');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithPastPath');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'setFinalePathAttributs');

    service.onDoubleClick(mockMouseEvent, mockLineTool);

    expect(service[inMouvement]).toBe(false);
    expect(service[isDrawing]).toBe(false);
    expect(service[closeLoop]).toHaveBeenCalledTimes(1);
    expect(service[drawCloseLoop]).toHaveBeenCalledTimes(1);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(1);
    expect(service[setFinalePathAttributs]).toHaveBeenCalledTimes(1);
  });

  // onBackspaceDown()
  it('onBackspaceDown should call fonctions', () => {
    service[isDrawing] = false;
    const mockCurrentPosition = new Position(CURRENT_POSITION_X, CURRENT_POSITION_Y);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'ifLastPoint').and.returnValue(true);
    spyOn(service[pathManipulation], 'getCurrentPosition').and.returnValue(mockCurrentPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'verifyPathString');
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithPastPath');

    service.onBackspaceDown(mockKeyboardEvent, mockLineTool);

    expect(service[ifLastPoint]).toHaveBeenCalledTimes(0);
    expect(service[pathManipulation].getCurrentPosition).toHaveBeenCalledTimes(0);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(0);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(0);

    service[isDrawing] = true;

    service.onBackspaceDown(mockKeyboardEvent, mockLineTool);

    expect(service[ifLastPoint]).toHaveBeenCalledTimes(1);
    expect(service[pathManipulation].getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(1);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(1);
  });

  it('onBackspaceDown should call fonctions', () => {
    service[isDrawing] = false;

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'ifLastPoint').and.returnValue(false);
    spyOn(service[pathManipulation], 'getCurrentPosition');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'verifyPathString');
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawWithPastPath');

    service.onBackspaceDown(mockKeyboardEvent, mockLineTool);

    expect(service[ifLastPoint]).toHaveBeenCalledTimes(0);
    expect(service[pathManipulation].getCurrentPosition).toHaveBeenCalledTimes(0);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(0);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(0);

    service[isDrawing] = true;

    service.onBackspaceDown(mockKeyboardEvent, mockLineTool);

    expect(service[ifLastPoint]).toHaveBeenCalledTimes(1);
    expect(service[pathManipulation].getCurrentPosition).toHaveBeenCalledTimes(0);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(0);
    expect(service[drawWithPastPath]).toHaveBeenCalledTimes(0);
  });

  // onEscapeClick()
  it('onEscapeClick should set isDrawing and in mouvement to true or false depending on isDrawing', () => {
    service[isDrawing] = false;
    service[inMouvement] = true;

    spyOn(service[pathDrawingService], 'setPathString');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergePaths');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'setFinalePathAttributs');

    service.onEscapeClick(mockKeyboardEvent);

    expect(service[isDrawing]).toBeFalsy();
    expect(service[inMouvement]).toBeTruthy();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();

    service[isDrawing] = true;
    service[inMouvement] = false;

    service.onEscapeClick(mockKeyboardEvent);

    expect(service[isDrawing]).toBeFalsy();
    expect(service[inMouvement]).toBeFalsy();
  });

  it('onEscapeClick should call fonctions', () => {
    service[isDrawing] = false;

    spyOn(service[pathDrawingService], 'setPathString');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergePaths');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'setFinalePathAttributs');

    service.onEscapeClick(mockKeyboardEvent);

    expect(service[mergePaths]).toHaveBeenCalledTimes(0);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(0);
    expect(service[setFinalePathAttributs]).toHaveBeenCalledTimes(0);
  });

  // onShiftDown(event: KeyboardEvent)
  it('onShiftDown should set isShiftPressed to false', () => {
    service[isShiftPressed] = false;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'angleLine');

    service.onShiftDown(mockKeyboardEvent, mockLineTool);

    expect(service[isShiftPressed]).toBe(true);
    expect(service[angleLine]).toHaveBeenCalled();
  });

  // onShiftUp(event: KeyboardEvent)
  it('onShiftUp should set isShiftPressed to false', () => {
    service[isShiftPressed] = true;

    service.onShiftUp(mockKeyboardEvent);

    expect(service[isShiftPressed]).toBe(false);

  });

  // onMouseEnter(event: MouseEvent)
  it('onMouseEnter should set isInElemento true', () => {
    service[isInElement] = false;
    service[isDrawing] = true;
    service.onMouseEnter(mockMouseEvent);

    expect(service[isInElement]).toBe(true);
  });

  it('onMouseEnter should throw error', () => {
    service[isInElement] = true;
    service[isDrawing] = false;
    try {
    service.onMouseEnter(mockMouseEvent);
    expect('to throw error').toBe('no error');
    } catch (error) {
      expect(1).toBe(1);
    }
  });

  // onMouseLeave(event: MouseEvent)
  it('onMouseLeave should set isInElement false', () => {
    service[isInElement] = true;
    service[isDrawing] = true;
    service.onMouseLeave(mockMouseEvent);

    expect(service[isInElement]).toBe(false);
  });

  it('onMouseLeave should throw error', () => {
    service[isInElement] = true;
    service[isDrawing] = false;
    try {
    service.onMouseLeave(mockMouseEvent);
    expect('to throw error').toBe('no error');
    } catch (error) {
      expect(1).toBe(1);
    }
  });

  // initializePath()
  it('initializePath should call fonctions a certain number of times', () => {
    const color = new Color(whiteColorValue, whiteColorValue, whiteColorValue, 1);
    mockLineTool.hasJunctionPoints = true;

    spyOn(service[renderer], 'createElement').and.returnValue(pathSVGElement);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[renderer], 'setAttribute');
    spyOn(service[pathDrawingService], 'setPathString');
    spyOn(service[pathDrawingService], 'initializePathString');

    service[initializePath](mockMouseEvent, mockLineTool, color);

    expect(service[renderer].createElement).toHaveBeenCalled();
    expect(service[renderer][setAttribute]).toHaveBeenCalledTimes(TIME_CALLED_4);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(1);
    expect(service[pathDrawingService].initializePathString).toHaveBeenCalledTimes(1);

    mockLineTool.hasJunctionPoints = false;

    service[initializePath](mockMouseEvent, mockLineTool, color);

    expect(service[renderer].createElement).toHaveBeenCalledTimes(2);
    expect(service[renderer][setAttribute]).toHaveBeenCalledTimes(TIME_CALLED_8);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(2);
    expect(service[pathDrawingService].initializePathString).toHaveBeenCalledTimes(2);
  });

  // initializeCirclePath()
  it('initializeCirclePath should call fonctions a certain number of times', () => {
    const color = new Color(whiteColorValue, whiteColorValue, whiteColorValue, 1);
    mockLineTool.hasJunctionPoints = true;

    spyOn(service[renderer], 'createElement').and.returnValue(pathSVGElement);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[renderer], 'setAttribute');
    spyOn(service[pathDrawingService], 'setPathString');
    spyOn(service[pathDrawingService], 'initializePathCircleString');

    service[initializeCirclePath](mockMouseEvent, mockLineTool, color);

    expect(service[renderer].createElement).toHaveBeenCalled();
    expect(service[renderer][setAttribute]).toHaveBeenCalledTimes(TIME_CALLED_4);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(1);
    expect(service[pathDrawingService].initializePathCircleString).toHaveBeenCalledTimes(1);

    mockLineTool.hasJunctionPoints = false;

    service[initializeCirclePath](mockMouseEvent, mockLineTool, color);

    expect(service[renderer].createElement).toHaveBeenCalledTimes(2);
    expect(service[renderer][setAttribute]).toHaveBeenCalledTimes(TIME_CALLED_5);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(2);
    expect(service[pathDrawingService].initializePathCircleString).toHaveBeenCalledTimes(1);
  });

  // initializeDrawing()
  it('initializeDrawing should call all fonction and set isDrawing to true', () => {
    service[isDrawing] = false;
    const color = new Color(whiteColorValue, whiteColorValue, whiteColorValue, 1);
    mockLineTool.hasJunctionPoints = false;

    spyOn(service[renderer], 'createElement').and.returnValue(pathSVGElement);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'initializePath');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'initializeCirclePath');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergePaths');

    service[initializeDrawing](mockMouseEvent, mockLineTool, color);

    expect(service[isDrawing]).toBeTruthy();
    expect(service[renderer].createElement).toHaveBeenCalled();
    expect(service[initializePath]).toHaveBeenCalled();
    expect(service[initializeCirclePath]).toHaveBeenCalled();
    expect(service[mergePaths]).toHaveBeenCalled();
  });

  it('initializeDrawing should call all fonction and set isDrawing to true', () => {
    service[isDrawing] = false;
    const color = new Color(whiteColorValue, whiteColorValue, whiteColorValue, 1);
    mockLineTool.hasJunctionPoints = true;

    spyOn(service[renderer], 'createElement').and.returnValue(pathSVGElement);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'initializePath');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'initializeCirclePath');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergePaths');

    service[initializeDrawing](mockMouseEvent, mockLineTool, color);

    expect(service[isDrawing]).toBeTruthy();
    expect(service[renderer].createElement).toHaveBeenCalled();
    expect(service[initializePath]).toHaveBeenCalled();
    expect(service[initializeCirclePath]).toHaveBeenCalled();
    expect(service[mergePaths]).toHaveBeenCalled();
  });

  // mergePaths()
  it('mergePath should call appendChild twice', () => {
    spyOn(service[renderer], 'appendChild').and.returnValue();

    service[mergePaths]();

    expect(service[renderer].appendChild).toHaveBeenCalledTimes(2);
  });

  // drawLine()
  it('drawLine should call fonctions', () => {
    service[isDrawing] = false;

    spyOn(service[pathDrawingService], 'lineCreatorString');
    spyOn(service[pathDrawingService], 'setPathString');

    service[drawLine](A_STRING, POSITION_50, POSITION_50);

    expect(service[pathDrawingService].lineCreatorString).toHaveBeenCalledTimes(0);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(0);
  });

  it('drawLine should not call fonctions', () => {
    service[isDrawing] = true;

    spyOn(service[pathDrawingService], 'lineCreatorString');
    spyOn(service[pathDrawingService], 'setPathString');

    service[drawLine](A_STRING, POSITION_50, POSITION_50);

    expect(service[pathDrawingService].lineCreatorString).toHaveBeenCalledTimes(1);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(1);
  });

  // drawCircle()
  it('drawCircle should not call fonctions', () => {
    service[isDrawing] = false;

    spyOn(service[pathDrawingService], 'circleCreatorString');
    spyOn(service[pathDrawingService], 'setPathString');

    service[drawCircle](A_STRING, POSITION_50, POSITION_50, mockLineTool);

    expect(service[pathDrawingService].circleCreatorString).toHaveBeenCalledTimes(0);
    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(0);
  });

  it('drawCircle should call fonctions', () => {
    service[isDrawing] = true;

    spyOn(service[pathDrawingService], 'setPathString');

    service[drawCircle](A_STRING, POSITION_50, POSITION_50, mockLineTool);

    expect(service[pathDrawingService].setPathString).toHaveBeenCalledTimes(1);
  });

  // setFinalePathAttributs
  it('setFinalePathAttributs should call setAttribute 2 time', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[renderer], setAttribute);

    service[setFinalePathAttributs]();

    expect(service[renderer][setAttribute]).toHaveBeenCalledTimes(2);
  });

  // ifLastPoint
  it('ifLastPoint should call all fonction', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'verifyPathString').and.returnValue(A_STRING);

    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    service[ifLastPoint]();

    expect(service[verifyPathString]).toHaveBeenCalledTimes(2);
    expect(service[pathContainer][svgElement.pathLine][getAttribute]).toHaveBeenCalledTimes(2);
  });

  // drawWithCurrentPath
  it('drawWithCurrentPath should call fonction right amount of times', () => {
    mockLineTool.hasJunctionPoints = false;

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, drawLine);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, drawCircle);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);
    service[pathContainer][svgElement.pathCircle] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    service[drawWithCurrentPath](A_NUMBER, A_NUMBER, mockLineTool);

    expect(service[drawLine]).toHaveBeenCalledTimes(1);
    expect(service[drawCircle]).toHaveBeenCalledTimes(0);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(1);

    mockLineTool.hasJunctionPoints = true;

    service[drawWithCurrentPath](A_NUMBER, A_NUMBER, mockLineTool);

    expect(service[drawLine]).toHaveBeenCalledTimes(2);
    expect(service[drawCircle]).toHaveBeenCalledTimes(1);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(callTimes3);
  });

  // drawWithPastPath
  it('drawWithPastPath should call fonction right amount of times', () => {
    mockLineTool.hasJunctionPoints = false;

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, drawLine);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, drawCircle);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], deleteLastPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);
    service[pathContainer][svgElement.pathCircle] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    service[drawWithPastPath](A_NUMBER, A_NUMBER, ONE_POINT, ONE_POINT, mockLineTool);

    expect(service[drawLine]).toHaveBeenCalledTimes(1);
    expect(service[drawCircle]).toHaveBeenCalledTimes(0);
    expect(service[pathManipulation][deleteLastPosition]).toHaveBeenCalledTimes(1);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(1);

    mockLineTool.hasJunctionPoints = true;

    service[drawWithPastPath](A_NUMBER, A_NUMBER, ONE_POINT, ONE_POINT, mockLineTool);

    expect(service[drawLine]).toHaveBeenCalledTimes(2);
    expect(service[drawCircle]).toHaveBeenCalledTimes(1);
    expect(service[pathManipulation][deleteLastPosition]).toHaveBeenCalledTimes(2);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(2);
  });

  it('drawWithPastPath should call getAttribute two times if there is junctionPoints', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, drawLine);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, drawCircle);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], deleteLastPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);

    const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
    mockPath.getAttribute.and.returnValue('test');
    service[pathContainer][svgElement.pathCircle] = mockPath;
    service[pathContainer][svgElement.pathLine] = mockPath;

    mockLineTool.hasJunctionPoints = true;

    service[drawWithPastPath](A_NUMBER, A_NUMBER, ONE_POINT, ONE_POINT, mockLineTool);
    expect(mockPath.getAttribute).toHaveBeenCalledTimes(2);
  });

  // drawCloseLoop
  it('drawCloseLoop should call fonction right amount of times', () => {
    mockLineTool.hasJunctionPoints = false;

    spyOn(service[pathDrawingService], 'setPathString');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], deleteLastPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);
    service[pathContainer][svgElement.pathCircle] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    service[drawCloseLoop](A_NUMBER, A_NUMBER, mockLineTool);

    expect(service[pathDrawingService][setPathString]).toHaveBeenCalledTimes(1);
    expect(service[pathManipulation][deleteLastPosition]).toHaveBeenCalledTimes(1);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(1);

    mockLineTool.hasJunctionPoints = true;

    service[drawCloseLoop](A_NUMBER, A_NUMBER, mockLineTool);

    expect(service[pathDrawingService][setPathString]).toHaveBeenCalledTimes(callTimes3);
    expect(service[pathManipulation][deleteLastPosition]).toHaveBeenCalledTimes(callTimes3);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(callTimes3);
  });

  // closeLoop
  it('closeLoop should call all fonction', () => {
    const mockCurrentPosition = new Position(CURRENT_POSITION_X, CURRENT_POSITION_Y);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], getFirstPosition).and.returnValue(mockCurrentPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    service[closeLoop](mockMouseEvent);

    expect(service[pathManipulation][getFirstPosition]).toHaveBeenCalledTimes(1);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(1);
  });

  it('closeLoop should not connect line', () => {
    const mockCurrentPosition = new Position(mockMouseEvent.offsetX + POSITION_50, mockMouseEvent.offsetY + POSITION_50);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], getFirstPosition).and.returnValue(mockCurrentPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    const retunrValue = service[closeLoop](mockMouseEvent);

    expect(retunrValue).toBeFalsy();
  });

  it('closeLoop should connect line', () => {
    const mockCurrentPosition = new Position(mockMouseEvent.offsetX, mockMouseEvent.offsetY);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], getFirstPosition).and.returnValue(mockCurrentPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    const retunrValue = service[closeLoop](mockMouseEvent);

    expect(retunrValue).toBeTruthy();
  });

  // getCurrentPosition
  it('getCurrentPosition should call all fonction', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], getCurrentPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    service[getCurrentPosition]();

    expect(service[pathManipulation][getCurrentPosition]).toHaveBeenCalledTimes(1);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(1);
  });

  it('getCurrentPosition should call no fonction', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], getCurrentPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    service[getCurrentPosition](mockMouseEvent);

    expect(service[pathManipulation][getCurrentPosition]).toHaveBeenCalledTimes(0);
    expect(service[verifyPathString]).toHaveBeenCalledTimes(0);
  });

  // getdifferenceBetweenPoints
  it('getdifferenceBetweenPoints should call all fonction', () => {
    const mockPastPosition = new Position(LAST_POSITION_X, LAST_POSITION_Y);
    const mockCurrentPosition = new Position(CURRENT_POSITION_X, CURRENT_POSITION_Y);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, getCurrentPosition).and.returnValue(mockCurrentPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], getPastPosition).and.returnValue(mockPastPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    service[getdifferenceBetweenPoints]();

    expect(service[pathManipulation][getPastPosition]).toHaveBeenCalled();
    expect(service[verifyPathString]).toHaveBeenCalled();
  });

  // mesureAngle
  it('mesureAngle should return right angle', () => {
    const mockCurrentPosition = new Position(CURRENT_POSITION_X, CURRENT_POSITION_Y);
    const mockPastPosition = new Position(LAST_POSITION_X, LAST_POSITION_Y);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, differenceBetweenPoints).and.returnValue(mockCurrentPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], getPastPosition).and.returnValue(mockPastPosition);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    let angle: number;
    angle = service[mesureAngle]();
    expect(angle).toBe(ANGLE_0);
  });

  // angleLine()
  it('angleLine should call all function in it s function', () => {
    service[pathContainer][svgElement.pathLine] = pathSVGElement;
    const mockPastPosition = new Position(LAST_POSITION_X, LAST_POSITION_Y);
    const mockCurrentPosition = new Position(CURRENT_POSITION_X, CURRENT_POSITION_Y);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, mesureAngle);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, getMouvement).and.returnValue(mockCurrentPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[pathManipulation], getPastPosition).and.returnValue(mockPastPosition);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, verifyPathString);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, drawWithPastPath);
    service[pathContainer][svgElement.pathLine] = jasmine.createSpyObj(pathLine, ['getAttribute']);

    service[angleLine](mockLineTool);

    expect(service[mesureAngle]).toHaveBeenCalled();
    expect(service[getMouvement]).toHaveBeenCalled();
    expect(service[pathManipulation][getPastPosition]).toHaveBeenCalled();
    expect(service[verifyPathString]).toHaveBeenCalled();
    expect(service[drawWithPastPath]).toHaveBeenCalled();

  });

  it('getMouvement should return right mouvement', () => {
    const mockDifferencePosition = new Position(POSITION_50, POSITION_50);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, differenceBetweenPoints).and.returnValue(mockDifferencePosition);

    let mouvement = service[getMouvement](ANGLE_0, mockMouseEvent);

    expect(mouvement.getX()).toEqual(POSITION_50);
    expect(mouvement.getY()).toEqual(POSITION_0);

    mouvement = service[getMouvement](ANGLE_45, mockMouseEvent);

    expect(mouvement.getX()).toEqual(POSITION_50);
    expect(mouvement.getY()).toEqual(-POSITION_50);

    mouvement = service[getMouvement](ANGLE_90, mockMouseEvent);

    expect(mouvement.getX()).toEqual(POSITION_0);
    expect(mouvement.getY()).toEqual(-POSITION_50);

    mouvement = service[getMouvement](ANGLE_135, mockMouseEvent);

    expect(mouvement.getX()).toEqual(POSITION_50);
    expect(mouvement.getY()).toEqual(POSITION_50);

    mouvement = service[getMouvement](ANGLE_MINUS_45, mockMouseEvent);

    expect(mouvement.getX()).toEqual(POSITION_50);
    expect(mouvement.getY()).toEqual(POSITION_50);
  });

  // verifyPathString
  it('verifyPathString should return a string', () => {
    const mockString = A_STRING;

    const returnValue = service[verifyPathString](mockString);

    expect(returnValue).toBe(mockString);
  });

  it('verifyPathString should trow an error', () => {
    const mockString = null;

    try {
      service[verifyPathString](mockString);
    } catch (error) {
      expect(1).toEqual(1);
    }
  });

// We disable this lint so we can spy on a private function
// tslint:disable-next-line: max-file-line-count
});
