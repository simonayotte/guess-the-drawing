import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AerosolComponent } from 'src/app/components/app/tools/aerosol-tool/aerosol/aerosol.component';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { AerosolService } from './aerosol.service';

const RENDERER = 'renderer';
const PATH_DRAWING_SERVICE = 'pathDrawingService';
const INITIALIZE_DRAWING = 'initializeDrawing';
const START_SPRAY_INTERVAL = 'startSprayInterval';
const DRAWING_HAS_STARTED = 'drawingStarted';
const UPDATE_POSITION = 'updatePosition';
const POSITION = 'position';
const COMMAND_INVOKER = 'commandInvoker';
const ADD_COMMAND = 'addCommand';
const CLEAR_INTERVAL = 'clearInterval';
const EMISSION_SPEED = 'emissionSpeed';
const DIAMETER = 'diameter';
const INITIALIZE_PATH = 'initializePath';
const CREATE_ELEMENT = 'createElement';
const SET_ATTRIBUTE = 'setAttribute';
const RANDOM_POSITION_IN_CIRCLE = 'randomPositionInCircle';
const CREATE_POINT = 'createPoint';
const RANDOM_NUMBER = 'randomNumber';
const SET_BASIC_ATTRIBUTES = 'setBasicAttributes';
const APPEND_CIRCLE_TO_MAIN_PATH = 'appendCircleToMainPath';
const APPEND_CHILD = 'appendChild';
const SET_INTERVAL = 'setInterval';
const eraserService = 'eraserService';
const ADD_PATH = 'addPath';
const CIRCLE_PATH = 'circlePath';
const POSITION_10 = 10;
const TIME_CALLED_15 = 15;
const TICK_TIME_2000 = 2000;
const TIMEOUT_1000 = 1000;
const EMISSION_SPEED_VALUE = 10;
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

describe('AerosolService', () => {

  let service: AerosolService;
  const mockMouseEvent = new MouseEvent('mouseEvent');
  const mockColor = new Color(1, 1, 1, 1);
  let mockAerosolComponent: AerosolComponent;
  const mockPath = jasmine.createSpyObj('path', ['getAttribute', 'getBoundingClientRect']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AerosolService] });
    service = TestBed.get(AerosolService);
    mockAerosolComponent = new AerosolComponent(service);
    service[RENDERER] = TestBed.get(Renderer2);
    service[POSITION] = [POSITION_10, POSITION_10];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initializerenderer should call initializeRenderer() from pathDrawingService and set the value of the renderer', () => {
    spyOn(service[PATH_DRAWING_SERVICE], 'initializeRenderer');
    const mockRenderer = service[RENDERER];
    service.initializeRenderer(mockRenderer);

    expect(service[PATH_DRAWING_SERVICE].initializeRenderer).toHaveBeenCalled();
    expect(service[RENDERER]).toBe(mockRenderer);
  });

  it('onMouseDownInElement should call initializeDrawing and start the spray interval', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_DRAWING);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, START_SPRAY_INTERVAL);

    service.onMouseDownInElement(mockMouseEvent, mockColor, mockAerosolComponent);

    expect(service[INITIALIZE_DRAWING]).toHaveBeenCalled();
    expect(service[START_SPRAY_INTERVAL]).toHaveBeenCalled();
  });

  it('onMouseDownInElement should set the position to the current position of the mouse', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_DRAWING);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, START_SPRAY_INTERVAL);
    service[POSITION] = [POSITION_10, POSITION_10];
    service.onMouseDownInElement(mockMouseEvent, mockColor, mockAerosolComponent);
    expect(service[POSITION]).toEqual([mockMouseEvent.offsetX, mockMouseEvent.offsetY]);
  });

  it('onMouseMove should set the position to the current position of the mouse if the drawing has started', () => {
    service[DRAWING_HAS_STARTED] = true;
    service[POSITION] = [POSITION_10, POSITION_10];
    service.onMouseMove(mockMouseEvent);
    expect(service[POSITION]).toEqual([mockMouseEvent.offsetX, mockMouseEvent.offsetY]);
  });

  it('onMouseMove should throw an error if the drawing has not started', () => {
    service[DRAWING_HAS_STARTED] = false;
    expect(() =>  {
      service.onMouseMove(mockMouseEvent);
    }).toThrowError();
  });

  it('updatePosition should set the position to the position of the mouseEvent', () => {
    service[POSITION] = [POSITION_10, POSITION_10];
    service[UPDATE_POSITION](mockMouseEvent);
    expect(service[POSITION]).toEqual([mockMouseEvent.offsetX, mockMouseEvent.offsetY]);
  });

  it('onMouseUp to clear interval, add a command and set drawingStarted to false if the drawing has started', () => {
    const PATH = 'pathContainer';
    const mockPathh = jasmine.createSpyObj('path', ['setAttribute']);
    service[DRAWING_HAS_STARTED] = true;
    spyOn(service[COMMAND_INVOKER], ADD_COMMAND);
    spyOn(window, CLEAR_INTERVAL);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service[PATH] = mockPathh;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[eraserService], ADD_PATH);
    service[DRAWING_HAS_STARTED] = true;
    service.onMouseUp();

    expect(service[COMMAND_INVOKER].addCommand).toHaveBeenCalled();
    expect(service[DRAWING_HAS_STARTED]).toBeFalsy();
    expect(window.clearInterval).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('onMouseUp should throw an error if the drawing has not started', () => {
    service[DRAWING_HAS_STARTED] = false;
    expect(() =>  {
      service.onMouseUp();
    }).toThrowError();
  });

  it('initializeDrawing should update the diameter of the spray, the emission speed and initialize the path', () => {
    const mockDiameter = 10;
    const mockSpeed = 50;
    mockAerosolComponent.diameter = mockDiameter;
    mockAerosolComponent.emissionPerSecond = mockSpeed;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_PATH);

    service[INITIALIZE_DRAWING](mockAerosolComponent, mockColor);

    expect(service[INITIALIZE_PATH]).toHaveBeenCalled();
    expect(service[DIAMETER]).toEqual(mockDiameter);
    expect(service[EMISSION_SPEED]).toEqual(mockSpeed);
  });

  it('createPoint should call getAttribute, randomPositionInCircle and then set the d attribute', () => {
    const circlePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spyOn(circlePath, 'getAttribute').and.returnValue('test');
    service[CIRCLE_PATH] = circlePath;
    spyOn(service[RENDERER], SET_ATTRIBUTE);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, RANDOM_POSITION_IN_CIRCLE).and.returnValue([0, 0]);

    service[CREATE_POINT]();

    expect(service[RANDOM_POSITION_IN_CIRCLE]).toHaveBeenCalled();
    expect(service[CIRCLE_PATH].getAttribute).toHaveBeenCalled();
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(1);
  });

  it('createPoint should call getAttribute, randomPositionInCircle and then set the d attribute', () => {
    const circlePath = jasmine.createSpyObj('circlePath', ['getAttribute']);
    mockPath.getAttribute.and.returnValue(undefined);
    service[CIRCLE_PATH] = circlePath;
    spyOn(service[RENDERER], SET_ATTRIBUTE);
    // tslint:disable-next-line: no-any --> to test private fonction
    spyOn<any>(service, RANDOM_POSITION_IN_CIRCLE).and.returnValue([0, 0]);

    service[CREATE_POINT]();

    expect(service[RANDOM_POSITION_IN_CIRCLE]).toHaveBeenCalled();
    expect(service[CIRCLE_PATH].getAttribute).toHaveBeenCalled();
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(1);
  });

  it('randomNumber return a number between two boundaries', () => {
    const minLimit = 10;
    const maxLimit = 100;
    const value = service[RANDOM_NUMBER](minLimit, maxLimit);
    expect(value).toBeLessThanOrEqual(maxLimit);
    expect(value).toBeGreaterThanOrEqual(minLimit);
  });

  it('initializePath should the drawingStarted to true, create the main path and set the basic attributes of the path', () => {
    service[DRAWING_HAS_STARTED] = false;
    spyOn(service[RENDERER], CREATE_ELEMENT);
    spyOn(service[PATH_DRAWING_SERVICE], SET_BASIC_ATTRIBUTES);

    service[INITIALIZE_PATH](mockColor);

    expect(service[DRAWING_HAS_STARTED]).toBeTruthy();
    expect(service[RENDERER].createElement).toHaveBeenCalled();
    expect(service[PATH_DRAWING_SERVICE].setBasicAttributes).toHaveBeenCalled();
  });

  it('appendCircleToMainPath should call appendChild one time', () => {
    spyOn(service[RENDERER], APPEND_CHILD);
    service[APPEND_CIRCLE_TO_MAIN_PATH](mockPath);
    expect(service[RENDERER].appendChild).toHaveBeenCalled();
  });

  it('startSprayInterval should set the interval for the spray', () => {
    spyOn(window, SET_INTERVAL);
    // tslint:disable-next-line: no-any --> to test private fonction
    spyOn<any>(service, CREATE_POINT);
    service[EMISSION_SPEED] = EMISSION_SPEED_VALUE;
    service[START_SPRAY_INTERVAL]();
    expect(window.setInterval).toHaveBeenCalled();
  });

  it('setInterval should call 15 times appendCircleToMainPath after one iteration of the interval', () => {
    jasmine.clock().install();
    setTimeout( () => {
      service[START_SPRAY_INTERVAL]();
    }, TIMEOUT_1000);

    // tslint:disable-next-line: no-any --> to test private fonction
    spyOn<any>(service, CREATE_POINT);
    service[EMISSION_SPEED] = 1;
    expect(service[CREATE_POINT]).toHaveBeenCalledTimes(0);
    jasmine.clock().tick(TICK_TIME_2000);
    expect(service[CREATE_POINT]).toHaveBeenCalledTimes(TIME_CALLED_15);
    jasmine.clock().uninstall();
  });

  it('randomPositionInCircle should generate two random numbers', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, RANDOM_NUMBER);

    service[RANDOM_POSITION_IN_CIRCLE]();

    expect(service[RANDOM_NUMBER]).toHaveBeenCalledTimes(2);
  });
});
