import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { SelectionMovementService } from './selection-movement.service';

const RENDERER = 'renderer';
const INITIALIZE_ELEMENTS = 'initializeElements';
const TRANSLATE_ALL_ELEMENTS = 'translateAllElements';
const STARTING_POSITION = 'startingPosition';
const CURRENT_TRANSLATE = 'currentTranslate';
const COMMAND_INVOKER = 'commandInvoker';
const ADD_COMMAND = 'addCommand';
const INITIAL_TRANSLATE = 'initialTranslate';
const SELECTED_ELEMENTS = 'selectedElements';
const ALL_ARROWS_ARE_UP = 'allArrowsAreUp';
const SET_ATTRIBUTE = 'setAttribute';
const MOVEMENT_STARTED = 'movementStarted';
const SELECTED_ARROWS = 'selectedArrows';
const ARROWS_TRANSLATE = 'arrowsTranslate';
const SELECTION_BOX_CALLBACK = 'selectionBoxCallBack';
const FIRST_ARROW_TRANSLATE = 'firstArrowTranslate';
const INITIALIZE_CONTINUOUS_TRANSLATE = 'initializeContinuousTranslate';
const SELECTION_MANIPULATION = 'selectionManipulation';
const GET = 'get';
const X = 0;
const Y = 0;
const TIME_CALLED_3 = 3;
const TIME_CALLED_4 = 4;
const POSTION_10 = 10;
const POSTION_20 = 20;
const TRANSLATE_AMOUT_10 = 10;
const TICK_TIME_500 = 500;

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

describe('SelectionMovementService', () => {
  let service: SelectionMovementService;
  const mockMouseEvent: MouseEvent = new MouseEvent('click');
  const path: SVGPathElement = {} as SVGPathElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SelectionMovementService]});
    service = TestBed.get(SelectionMovementService);
    service[RENDERER] = TestBed.get(Renderer2);
    service[SELECTION_BOX_CALLBACK] = () => {return; };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('firstArrowTranslate should call arrowsTranslate and set movementStarted to false if all arrows are up', () => {
    jasmine.clock().install();
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ARROWS_TRANSLATE);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ALL_ARROWS_ARE_UP).and.returnValue(true);
    service[MOVEMENT_STARTED] = true;
    service[FIRST_ARROW_TRANSLATE]();
    jasmine.clock().tick(TICK_TIME_500);
    expect(service[ARROWS_TRANSLATE]).toHaveBeenCalled();
    expect(service[MOVEMENT_STARTED]).toBeFalsy();
    jasmine.clock().uninstall();
  });

  it('firstArrowTranslate should call initializeContinuousTranslate if not all arrows are up', () => {
    jasmine.clock().install();
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ARROWS_TRANSLATE);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ALL_ARROWS_ARE_UP).and.returnValue(false);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_CONTINUOUS_TRANSLATE);
    service[FIRST_ARROW_TRANSLATE]();
    jasmine.clock().tick(TICK_TIME_500);
    expect(service[INITIALIZE_CONTINUOUS_TRANSLATE]).toHaveBeenCalled();
    jasmine.clock().uninstall();
  });

  it('initializeContinuousTranslate should call arrowsTranslate after a certain delay', () => {
    jasmine.clock().install();
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ARROWS_TRANSLATE);
    service[INITIALIZE_CONTINUOUS_TRANSLATE]();
    jasmine.clock().tick(TICK_TIME_500);
    expect(service[ARROWS_TRANSLATE]).toHaveBeenCalled();
    jasmine.clock().uninstall();
  });

  it('initializeMovement should set the mouse position as th e starting position and initialize the elements', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_ELEMENTS);
    service.initializeMovement(mockMouseEvent, []);
    expect(service[INITIALIZE_ELEMENTS]).toHaveBeenCalled();
    expect(service[STARTING_POSITION][X]).toBe(mockMouseEvent.offsetX);
    expect(service[STARTING_POSITION][Y]).toBe(mockMouseEvent.offsetY);
  });

  it('onMouseMove should update the current translate and translate all the selectedElements', () => {
    service[STARTING_POSITION] = [POSTION_10, POSTION_20];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, TRANSLATE_ALL_ELEMENTS);

    service.onMouseMove(mockMouseEvent);

    expect(service[CURRENT_TRANSLATE][X]).toBe(mockMouseEvent.offsetX - service[STARTING_POSITION][X]);
    expect(service[CURRENT_TRANSLATE][Y]).toBe(mockMouseEvent.offsetY - service[STARTING_POSITION][Y]);
    expect(service[TRANSLATE_ALL_ELEMENTS]).toHaveBeenCalled();
  });

  it('onMouseUp should add a command if the current translate is not 0', () => {
    service[CURRENT_TRANSLATE] = [1, 0];
    spyOn(service[COMMAND_INVOKER], ADD_COMMAND);

    service.onMouseUp();

    expect(service[COMMAND_INVOKER].addCommand).toHaveBeenCalled();
  });

  it('onMouseUp should not add a command if the current translate is 0', () => {
    service[CURRENT_TRANSLATE] = [0, 0];
    spyOn(service[COMMAND_INVOKER], ADD_COMMAND);

    service.onMouseUp();

    expect(service[COMMAND_INVOKER].addCommand).toHaveBeenCalledTimes(0);
  });

  it('intializeRenderer should set the value of the renderer of the service to the one in parameter', () => {
    const mockRenderer = service[RENDERER];
    service.initializeRenderer(mockRenderer);
    expect(service[RENDERER]).toBe(mockRenderer);
  });

  it('initializeElements should update the selected elements, set the current translate to 0 and do the initial translate', () => {
    service[CURRENT_TRANSLATE] = [POSTION_10, POSTION_10];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIAL_TRANSLATE);

    service[INITIALIZE_ELEMENTS]([path]);

    expect(service[SELECTED_ELEMENTS]).toEqual([path]);
    expect(service[INITIAL_TRANSLATE]).toHaveBeenCalled();
    expect(service[CURRENT_TRANSLATE][X]).toBe(0);
    expect(service[CURRENT_TRANSLATE][Y]).toBe(0);
  });

  it('allArrowsAreUp should return true if all the arrows in the map are not down', () => {
    const arrowKeysDown = new Map();
    arrowKeysDown.set('ArrowUp', false);
    arrowKeysDown.set('ArrowRight', false);
    arrowKeysDown.set('ArrowDown', false);
    arrowKeysDown.set('ArrowLeft', false);
    service[SELECTED_ARROWS] = arrowKeysDown;

    expect(service[ALL_ARROWS_ARE_UP]()).toBeTruthy();
  });

  it('allArrowsAreUp should return false if at least one the arrows is down', () => {
    const arrowKeysDown = new Map();
    arrowKeysDown.set('ArrowUp', false);
    arrowKeysDown.set('ArrowRight', true);
    arrowKeysDown.set('ArrowDown', false);
    arrowKeysDown.set('ArrowLeft', false);
    service[SELECTED_ARROWS] = arrowKeysDown;
    expect(service[ALL_ARROWS_ARE_UP]()).toBeFalsy();
  });

  it('InitialTranslate should call set attribute for each selected elements', () => {
    const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
    spyOn(service[RENDERER], SET_ATTRIBUTE);
    spyOn(service[SELECTION_MANIPULATION], 'updateRotation');
    service[SELECTED_ELEMENTS] = [mockPath, mockPath, mockPath];
    service[INITIAL_TRANSLATE]();
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(TIME_CALLED_3);
  });

  it('InitialTranslate should add the initial translate after the existing tranform of all elements', () => {
    const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
    mockPath.getAttribute.and.returnValue('translate(10 10)');
    spyOn(service[RENDERER], SET_ATTRIBUTE);
    spyOn(service[SELECTION_MANIPULATION], 'updateRotation');
    service[SELECTED_ELEMENTS] = [mockPath, mockPath, mockPath];
    service[INITIAL_TRANSLATE]();
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(TIME_CALLED_3);
  });

  it('initializeSelectionBoxCallBack should set the callback to the one passed as a parameter', () => {
    const mockCallback = (() => {return; });
    service.initalizeSelectionBoxCallBack(mockCallback);
    expect(service[SELECTION_BOX_CALLBACK]).toEqual(mockCallback);
  });

  it('translateAllElements should call translateElement for each selectedElement and update the selection box', () => {
    const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
    service[CURRENT_TRANSLATE] = [POSTION_10, POSTION_10];
    service[SELECTION_BOX_CALLBACK] = (() => { return; });
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, SELECTION_BOX_CALLBACK);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'translateElement');
    service[SELECTED_ELEMENTS] = [mockPath, mockPath];
    service[TRANSLATE_ALL_ELEMENTS]();
    expect(service.translateElement).toHaveBeenCalledTimes(2);
    expect(service[SELECTION_BOX_CALLBACK]).toHaveBeenCalled();
  });

  it('translateElement should delete the last rotate and update the rotation if the transform string exist', () => {
    const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
    mockPath.getAttribute.and.returnValue('transform');
    spyOn(service[SELECTION_MANIPULATION], 'deleteLastRotate');
    spyOn(service[SELECTION_MANIPULATION], 'updateRotation');
    service.translateElement(mockPath, 'translate');
    expect(service[SELECTION_MANIPULATION].updateRotation).toHaveBeenCalled();
    expect(service[SELECTION_MANIPULATION].deleteLastRotate).toHaveBeenCalled();
  });

  it('translateElement should not delete the last rotate and update the rotation if the transform string does not exist', () => {
    const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
    mockPath.getAttribute.and.returnValue(null);
    spyOn(service[SELECTION_MANIPULATION], 'deleteLastRotate');
    spyOn(service[SELECTION_MANIPULATION], 'updateRotation');
    service.translateElement(mockPath, 'translate');
    expect(service[SELECTION_MANIPULATION].updateRotation).toHaveBeenCalledTimes(0);
    expect(service[SELECTION_MANIPULATION].deleteLastRotate).toHaveBeenCalledTimes(0);
  });

  it('onArrowsChange should add a command if the movement has started and all arrows are up and set movementStarted to false', () => {
    const arrowKeysDown = new Map();
    arrowKeysDown.set('ArrowUp', false);
    arrowKeysDown.set('ArrowRight', false);
    arrowKeysDown.set('ArrowDown', false);
    arrowKeysDown.set('ArrowLeft', false);

    service[MOVEMENT_STARTED] = true;
    service[CURRENT_TRANSLATE] = [POSTION_10, POSTION_10];
    spyOn(service[COMMAND_INVOKER], ADD_COMMAND);

    service.onArrowsChange(arrowKeysDown, []);

    expect(service[COMMAND_INVOKER].addCommand).toHaveBeenCalled();
    expect(service[MOVEMENT_STARTED]).toBeFalsy();
  });

  it('onArrowsChange should call initializeElements and set movementStarted to true if the movement has not started', () => {
    const arrowKeysDown = new Map();
    arrowKeysDown.set('ArrowUp', false);
    arrowKeysDown.set('ArrowRight', false);
    arrowKeysDown.set('ArrowDown', false);
    arrowKeysDown.set('ArrowLeft', false);

    service[MOVEMENT_STARTED] = false;
    service[CURRENT_TRANSLATE] = [POSTION_10, POSTION_10];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, TRANSLATE_ALL_ELEMENTS);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_ELEMENTS);
    service.onArrowsChange(arrowKeysDown, []);

    expect(service[MOVEMENT_STARTED]).toBeTruthy();
    expect(service[INITIALIZE_ELEMENTS]).toHaveBeenCalled();
  });

  it('onArrowsChange should set the selectedArrows as the selectedArrows passe in parameters', () => {
    const initialArrowKeysDown = new Map();
    initialArrowKeysDown.set('ArrowUp', true);
    initialArrowKeysDown.set('ArrowRight', true);
    initialArrowKeysDown.set('ArrowDown', true);
    initialArrowKeysDown.set('ArrowLeft', true);
    const finalArrowKeysDown = new Map();
    finalArrowKeysDown.set('ArrowUp', false);
    finalArrowKeysDown.set('ArrowRight', false);
    finalArrowKeysDown.set('ArrowDown', false);
    finalArrowKeysDown.set('ArrowLeft', false);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ALL_ARROWS_ARE_UP).and.returnValue(false);
    service[MOVEMENT_STARTED] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, TRANSLATE_ALL_ELEMENTS);
    service[SELECTED_ARROWS] = initialArrowKeysDown;

    service.onArrowsChange(finalArrowKeysDown, []);
    expect(service[SELECTED_ARROWS]).toEqual(finalArrowKeysDown);
  });

  it('arrowTranslate should update the currentTranslate based on which arrows is down and then call translateAllElements', () => {
    const arrowKeysDown = new Map();
    arrowKeysDown.set('ArrowUp', true);
    arrowKeysDown.set('ArrowRight', true);
    arrowKeysDown.set('ArrowDown', true);
    arrowKeysDown.set('ArrowLeft', true);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, TRANSLATE_ALL_ELEMENTS);
    service[CURRENT_TRANSLATE] = [POSTION_10, POSTION_10];
    service[MOVEMENT_STARTED] = true;
    service[SELECTED_ARROWS] = arrowKeysDown;

    service[ARROWS_TRANSLATE]();

    expect(service[CURRENT_TRANSLATE][X]).toBe(TRANSLATE_AMOUT_10);
    expect(service[CURRENT_TRANSLATE][Y]).toBe(TRANSLATE_AMOUT_10);
    expect(service[TRANSLATE_ALL_ELEMENTS]).toHaveBeenCalled();
  });

  it('arrowTranslate should get the call get on the map for each arrow', () => {
    const arrowKeysDown = new Map();
    spyOn(arrowKeysDown, GET);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, TRANSLATE_ALL_ELEMENTS);
    service[SELECTED_ARROWS] = arrowKeysDown;
    service[CURRENT_TRANSLATE] = [POSTION_10, POSTION_10];

    service[ARROWS_TRANSLATE]();

    expect(arrowKeysDown.get).toHaveBeenCalledTimes(TIME_CALLED_4);
  });
// We disabled this rule since this is a test file and the line count isnt important
// tslint:disable-next-line: max-file-line-count
});
