import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { SelectionToolService } from './selection-tool.service';

const RENDERER = 'renderer';
const PATH_DRAWING_SERVICE = 'pathDrawingService';
const SELECTION_MOVEMENT_SERVICE = 'selectionMovementService';
const SELECTED_ELEMENTS = 'selectedElements';
const CREATE_BOUNDING_BOX = 'createBoundingBoxRectangle';
const EVENT_STARTED = 'eventStarted';
const INITIALIZE_PATH_ARRAY = 'initializePathArray';
const MERGE_ALL_PATH = 'mergeAllPath';
const ELEMENT_TO_ADD = 'elementToAdd';
const IS_ON_CONTROL_POINT = 'isOnControlPoint';
const RESET_ALL_SELECTION = 'resetAllSelection';
const RESET_PATH = 'resetPath';
const MOUSE_CLICK_BOUNDING_BOX = 'onMouseClickInBoundingBox';
const INITIALIZE_MOVEMENT = 'initializeMovement';
const MOUSE_DOWN_IN_ELEMENT = 'onMouseDownInElement';
const IN_SELECTED_ELEMENT_BOX = 'isInSelectedElementBox';
const INITIALIZE_SELECTION = 'initializeSelection';
const INITIALIZE_SELECTION_RECTANGLE = 'initializeSelectionRectangle';
const ELEMENT_IS_SELECTED = 'elementIsSelected';
const ON_MOUSE_UP = 'onMouseUp';
const CREATE_ELEMENT = 'createElement';
const EVENT_HAS_STARTED = 'eventHasStarted';
const SET_PATH_STRING = 'setPathString';
const INVERTED_SELECTION_ELEMENTS = 'invertedSelectionElements';
const SET_BASIC_ATTRIBUTES = 'setBasicAttributes';
const MOUSE_MOVE = 'onMouseMove';
const INVERTED_SELECTION_FUNCTION = 'invertedSelection';
const POSITION = 'position';
const SELECTING_ELEMENTS = 'selectingElements';
const PREVENT_DEFAULT = 'preventDefault';
const ON_ARROWS_CHANGE = 'onArrowsChange';
const DRAW_RECTANGLE = 'drawRectangle';
const FIND_ALL_SELECTED_ELEMENTS = 'findAllSelectedElements';
const SELECTED_ELEMENTS_SERVICE = 'selectedElementService';
const PATHS = 'paths';
const SET_PERIMETER_ATTRIBUTES = 'setPerimeterAttributes';
const IS_IN_RECTANGLE = 'isInRectangle';
const CONTROL_POINTS_PATH_STRING = 'controlPointsPathString';
const APPEND_CHILD = 'appendChild';
const GET_PATH_WIDTH = 'getPathWidth';
const SVG_ELEMENT = 'svgElement';
const SELECT_ALL_ELEMENTS = 'selectAllElements';
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';
const IS_IN_ELEMENT = 'isInElement';

const SVG_INDEX = 0;
const SELECTION_RECTANGLE_INDEX = 1;
const SELECTED_ELEMENT_PATH_INDEX = 2;
const CALL_TIMES_3 = 3;
const CALL_TIMES_4 = 4;
const CALL_TIMES_5 = 5;
const CONTROL_POINTS = 3;
const SELECTION = 0;
const INVERTED_SELECTION = 1;
const SELECTION_MOVEMENT_STARTED = 2;
const MOUSE_HAS_MOVED = 3;

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

describe('SelectionToolService', () => {
  let service: SelectionToolService;
  const mockMouseEvent: MouseEvent = new MouseEvent('click');
  const mockPath = jasmine.createSpyObj('path', ['getAttribute', 'getBoundingClientRect']);

  beforeEach(async(() => TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]})));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SelectionToolService]});
    service = TestBed.get(SelectionToolService);
    service[RENDERER] = TestBed.get(Renderer2);
    service.initializeRenderer(service[RENDERER]);
    service[EVENT_STARTED] = [false, false, false, false];
    service[SELECTED_ELEMENTS] = [];
    service[IS_IN_ELEMENT] = false;
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('setSelectedElements should set the elements to selected and call createboundingbox', () => {
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // Nous desactivons la regle lint car nous devons acceder a une fontion privée
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'createBoundingBoxRectangle');
    // Nous desactivons la regle lint car nous devons acceder a une fontion privée
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'resetAllSelection');
    spyOn(service, 'autoSaveDrawing');
    const path  = {} as SVGPathElement;
    path.getAttribute = jasmine.createSpy().and.callFake(() => {return; });
    const paths = [path, path, path];
    service[PATHS] = [path];
    service[CREATE_BOUNDING_BOX] = jasmine.createSpy().and.callFake(() => {return; });
    service.setSelectedElements(paths);
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalledTimes(1);
  });
  it('setSelectedElements should not call createboudingbox if the svg path is not defined', () => {
    const path  = {} as SVGPathElement;
    spyOn(service, 'autoSaveDrawing');
    path.getAttribute = jasmine.createSpy().and.callFake(() => {return; });
    const paths = [path, path, path];
    service[CREATE_BOUNDING_BOX] = jasmine.createSpy().and.callFake(() => {return; });
    service.setSelectedElements(paths);
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalledTimes(0);
    service.selectedElements = [];
  });

  it('onMouseLeave', () => {
    service.isInElement = true;
    spyOn(service, 'onMouseUp');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergeAllPath');
    service.onMouseLeave(mockMouseEvent);

    expect(service.isInElement).toBe(false);
    expect(service.onMouseUp).toHaveBeenCalled();
    expect(service[MERGE_ALL_PATH]).toHaveBeenCalled();
  });

  it('onMouseEnter', () => {
    service.isInElement = false;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'mergeAllPath');
    service.onMouseEnter(mockMouseEvent);

    expect(service.isInElement).toBe(true);
    expect(service[MERGE_ALL_PATH]).toHaveBeenCalled();
  });

  it('initializerenderer should call initializeRenderer() selectionMovementService', () => {
    spyOn(service[SELECTION_MOVEMENT_SERVICE], 'initializeRenderer');
    const mockRenderer = service[RENDERER];

    service.initializeRenderer(mockRenderer);

    expect(service[SELECTION_MOVEMENT_SERVICE].initializeRenderer).toHaveBeenCalled();
    expect(service[RENDERER]).toBe(mockRenderer);
  });

  it('autoSaveDraing should create the boundingbox two times and call autoSaveDrawing of continueDrawingService', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service.autoSaveDrawing();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalledTimes(2);
  });

  it('onMouseClickInBoundingBox should update the selectedElements if the element to add is not null', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ELEMENT_TO_ADD).and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX).and.returnValue(null);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');
    spyOn(service[PATH_DRAWING_SERVICE], 'setPathString');

    service[SELECTED_ELEMENTS] = [];
    service[MOUSE_CLICK_BOUNDING_BOX](mockMouseEvent);

    expect(service[SELECTED_ELEMENTS]).toEqual([mockPath]);
  });

  it('onMouseClickInBoundingBox should not update the selectedElements if the element to add is null', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ELEMENT_TO_ADD).and.returnValue(null);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX).and.returnValue(null);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[SELECTED_ELEMENTS] = [];
    service[MOUSE_CLICK_BOUNDING_BOX](mockMouseEvent);

    expect(service[SELECTED_ELEMENTS]).toEqual([]);
  });

  it('onMouseClickInBoundingBox should initializeMovement, create the boundingbox rectangle and set the list of started events', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ELEMENT_TO_ADD).and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX).and.returnValue(null);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[SELECTION_MOVEMENT_SERVICE], INITIALIZE_MOVEMENT).and.returnValue(null);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[SELECTED_ELEMENTS] = [];

    service[MOUSE_CLICK_BOUNDING_BOX](mockMouseEvent);
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
    expect(service[SELECTION_MOVEMENT_SERVICE].initializeMovement).toHaveBeenCalled();
    expect(service[EVENT_STARTED]).toEqual([false, false, true, false]);
  });

  it('onMouseDownInElement should only mergeAllAPath if the click is on a controlPoint', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(true);
    // Add test for the resize
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, MERGE_ALL_PATH);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[MOUSE_DOWN_IN_ELEMENT](mockMouseEvent);

    expect(service[MERGE_ALL_PATH]).toHaveBeenCalled();
  });

  it('onMouseDownInElement should call onMouseClickInBoundingBox if the click is in the Box and there is a selected element', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(false);
    service[SELECTED_ELEMENTS] = [mockPath];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IN_SELECTED_ELEMENT_BOX).and.returnValue(true);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, MOUSE_CLICK_BOUNDING_BOX);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[MOUSE_DOWN_IN_ELEMENT](mockMouseEvent);

    expect(service[MOUSE_CLICK_BOUNDING_BOX]).toHaveBeenCalled();
  });

  it('onMouseDownInElement should initialize the selection if no event has started', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(false);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IN_SELECTED_ELEMENT_BOX).and.returnValue(false);
    service[SELECTED_ELEMENTS] = [mockPath];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_PATH_ARRAY);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_SELECTION);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, RESET_ALL_SELECTION);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, MERGE_ALL_PATH);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[MOUSE_DOWN_IN_ELEMENT](mockMouseEvent);

    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
    expect(service[INITIALIZE_PATH_ARRAY]).toHaveBeenCalled();
    expect(service[INITIALIZE_SELECTION]).toHaveBeenCalled();
    expect(service[RESET_ALL_SELECTION]).toHaveBeenCalled();
    expect(service[MERGE_ALL_PATH]).toHaveBeenCalled();
  });

  it('onMouseDownInElement should not initialize the selection if a event has started', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(false);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IN_SELECTED_ELEMENT_BOX).and.returnValue(false);
    service[SELECTED_ELEMENTS] = [mockPath];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_PATH_ARRAY);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_SELECTION);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, RESET_ALL_SELECTION);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, MERGE_ALL_PATH);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[EVENT_STARTED] = [true, true, false, false];
    service[MOUSE_DOWN_IN_ELEMENT](mockMouseEvent);

    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalledTimes(0);
    expect(service[INITIALIZE_PATH_ARRAY]).toHaveBeenCalledTimes(0);
    expect(service[INITIALIZE_SELECTION]).toHaveBeenCalledTimes(0);
    expect(service[RESET_ALL_SELECTION]).toHaveBeenCalledTimes(0);
    expect(service[MERGE_ALL_PATH]).toHaveBeenCalledTimes(1);
  });

  it('onMouseDownInElement should add the element clicked in the selected elements and initialize the Movement of the selection', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(false);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_SELECTION);

    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IN_SELECTED_ELEMENT_BOX).and.returnValue(false);
    service[SELECTED_ELEMENTS] = [];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ELEMENT_TO_ADD).and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX).and.returnValue(null);
    spyOn(service[SELECTION_MOVEMENT_SERVICE], INITIALIZE_MOVEMENT);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[MOUSE_DOWN_IN_ELEMENT](mockMouseEvent);

    expect(service[SELECTED_ELEMENTS]).toEqual([mockPath]);
    expect(service[SELECTION_MOVEMENT_SERVICE].initializeMovement).toHaveBeenCalled();
    expect(service[EVENT_STARTED][SELECTION_MOVEMENT_STARTED]).toBeTruthy();
    expect(service[EVENT_STARTED][SELECTION]).toBeFalsy();
  });

  it('elementIsSelected should return true if the element is already selected', () => {
    service[SELECTED_ELEMENTS] = [null, mockPath];

    service[ELEMENT_IS_SELECTED](mockPath);

    expect(service[ELEMENT_IS_SELECTED](mockPath)).toBeTruthy();
  });

  it('elementIsSelected should return false if the element is not already selected', () => {
    service[SELECTED_ELEMENTS] = [];

    service[ELEMENT_IS_SELECTED](mockPath);

    expect(service[ELEMENT_IS_SELECTED](mockPath)).toBeFalsy();
  });

  it('onMouseUp should call onMouseUp of selectionMovementService if the movement has started', () => {
    service[EVENT_STARTED][SELECTION_MOVEMENT_STARTED] = true;
    spyOn(service[SELECTION_MOVEMENT_SERVICE], ON_MOUSE_UP);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');
    spyOn(service[PATH_DRAWING_SERVICE], 'setPathString');

    service.onMouseUp(mockMouseEvent);

    expect(service[SELECTION_MOVEMENT_SERVICE].onMouseUp).toHaveBeenCalled();
  });

  it('onMouseUp should call element to add and add the selected element if the selection has started', () => {
    service[EVENT_STARTED][SELECTION] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ELEMENT_TO_ADD).and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX).and.returnValue(null);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'resetPath');

    service.onMouseUp(mockMouseEvent);

    expect(service[ELEMENT_TO_ADD]).toHaveBeenCalled();
    expect(service[SELECTED_ELEMENTS]).toEqual([mockPath]);
  });

  it('onMouseUp should empty the selected elements if the selected element is null', () => {
    service[EVENT_STARTED][SELECTION] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ELEMENT_TO_ADD).and.returnValue(null);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX).and.returnValue(null);
    spyOn(service[PATH_DRAWING_SERVICE], 'setPathString');
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service.onMouseUp(mockMouseEvent);

    expect(service[ELEMENT_TO_ADD]).toHaveBeenCalled();
    expect(service[SELECTED_ELEMENTS]).toEqual([]);
  });

  it('onMouse should not modify the selectedElements if the target is the control ponts', () => {
    service[EVENT_STARTED][SELECTION] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any --> to test private fonction
    spyOn<any>(service, ELEMENT_TO_ADD).and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any --> to test private fonction
    spyOn<any>(service, CREATE_BOUNDING_BOX).and.returnValue(null);
    spyOn(service[PATH_DRAWING_SERVICE], 'setPathString');
    service[PATHS][CONTROL_POINTS] = mockPath;
    service[SELECTED_ELEMENTS] = [mockPath];
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service.onMouseUp(mockMouseEvent);

    expect(service[ELEMENT_TO_ADD]).toHaveBeenCalled();
    expect(service[SELECTED_ELEMENTS]).toEqual([mockPath]);
  });

  it('onMouseUp should call resetPath and mergeAllPath even if no event has started', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, RESET_PATH);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, MERGE_ALL_PATH);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service.onMouseUp(mockMouseEvent);

    expect(service[MERGE_ALL_PATH]).toHaveBeenCalled();
    expect(service[RESET_PATH]).toHaveBeenCalled();
  });

  it('onMouseUp should call resetPath and mergeAllPath even if no event has started', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, RESET_PATH);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, MERGE_ALL_PATH);
     // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'createBoundingBoxRectangle');
    service.isInElement = true;
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service.onMouseUp(mockMouseEvent);

    expect(service[MERGE_ALL_PATH]).toHaveBeenCalled();
    expect(service[RESET_PATH]).toHaveBeenCalled();
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('onRightClickDown should call mergeAllPath', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, MERGE_ALL_PATH);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(true);

    service.onRightClickDown(mockMouseEvent);

    expect(service[MERGE_ALL_PATH]).toHaveBeenCalled();
  });

  it('onRightClickDown should initializePathArray, SelectionRectangle and CreateBoundingBoxRectangle if not event has started', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(false);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_PATH_ARRAY);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_SELECTION_RECTANGLE);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service.onRightClickDown(mockMouseEvent);

    expect(service[INITIALIZE_PATH_ARRAY]).toHaveBeenCalled();
    expect(service[INITIALIZE_SELECTION_RECTANGLE]).toHaveBeenCalled();
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
  });

  it('onRightClickDown should not initializePathArray, SelectionRectangle and CreateBoundingBoxRectangle if a event has started', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(false);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_PATH_ARRAY);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_SELECTION_RECTANGLE);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[EVENT_STARTED] = [true, true, false, false];
    service.onRightClickDown(mockMouseEvent);

    expect(service[INITIALIZE_PATH_ARRAY]).toHaveBeenCalledTimes(0);
    expect(service[INITIALIZE_SELECTION_RECTANGLE]).toHaveBeenCalledTimes(0);
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalledTimes(0);
  });

  it('onRightClickDown should update the position and list of started events', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(false);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'initializeSelectionRectangle');
    spyOn(service[PATH_DRAWING_SERVICE], 'setPathString');

    service.onRightClickDown(mockMouseEvent);

    expect(service[POSITION]).toEqual([mockMouseEvent.offsetX, mockMouseEvent.offsetY]);
    expect(service[EVENT_STARTED]).toEqual([false, true, false, false]);
  });

  it('onRightClickDown should delete the element selected from the selected elements if its selected', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(false);
    service[SELECTED_ELEMENTS] = [mockPath];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ELEMENT_TO_ADD).and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'initializeSelectionRectangle');

    service.onRightClickDown(mockMouseEvent);

    expect(service[SELECTED_ELEMENTS]).toEqual([]);
  });

  it('onRightClickDown should element the element selected from the selected elements if its not selected', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_ON_CONTROL_POINT).and.returnValue(false);
    service[SELECTED_ELEMENTS] = [];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, ELEMENT_TO_ADD).and.returnValue(mockPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'initializeSelectionRectangle');
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service.onRightClickDown(mockMouseEvent);

    expect(service[SELECTED_ELEMENTS]).toEqual([mockPath]);
  });

  it('onMouseMove should set the event MouseHasMoved to true and call mergeAllPath,selectingElements if the selection has started', () => {
    service[EVENT_STARTED][SELECTION] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, MERGE_ALL_PATH);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, SELECTING_ELEMENTS);

    service[MOUSE_MOVE](mockMouseEvent);

    expect(service[EVENT_STARTED][MOUSE_HAS_MOVED]).toBeTruthy();
    expect(service[MERGE_ALL_PATH]).toHaveBeenCalled();
  });

  it('onMouseMove should throw an error if no event has started', () => {
    expect(() =>  {
      service[MOUSE_MOVE](mockMouseEvent);
    }).toThrowError();
  });

  it('onMouseMove should call invertedSelection if the invertedSelection has started', () => {
    service[EVENT_STARTED][INVERTED_SELECTION] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INVERTED_SELECTION_FUNCTION);

    service[MOUSE_MOVE](mockMouseEvent);

    expect(service[INVERTED_SELECTION_FUNCTION]).toHaveBeenCalled();
  });

  it('onMouseMove should create BoundingBoxRectangle and call onMouseMove of movementService if the movement has started', () => {
    service[EVENT_STARTED][SELECTION_MOVEMENT_STARTED] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[SELECTION_MOVEMENT_SERVICE], MOUSE_MOVE);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);

    service[MOUSE_MOVE](mockMouseEvent);

    expect(service[SELECTION_MOVEMENT_SERVICE].onMouseMove).toHaveBeenCalled();
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
  });

  it('selectAllElements should call initializePathArray, setBasicAttributes, createBoundingBox and mergeAllPath', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_PATH_ARRAY);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[PATH_DRAWING_SERVICE], SET_BASIC_ATTRIBUTES);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, MERGE_ALL_PATH);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    const mockSvg = jasmine.createSpyObj('svg', ['children']);
    mockSvg.children.and.returnValue([mockPath]);
    service[SVG_ELEMENT] = mockSvg;
    service[SELECT_ALL_ELEMENTS]();

    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
    expect(service[INITIALIZE_PATH_ARRAY]).toHaveBeenCalled();
    expect(service[PATH_DRAWING_SERVICE].setBasicAttributes).toHaveBeenCalled();
    expect(service[MERGE_ALL_PATH]).toHaveBeenCalled();
  });

  it('selectAllElements should add all the elements in the svg that are not filter to the selected elements', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[PATH_DRAWING_SERVICE], 'setBasicAttributes');
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service.svgElement = {children: [mockPath, mockPath] as unknown as HTMLCollection} as SVGElement;
    service[SELECT_ALL_ELEMENTS]();

    expect(service[SELECTED_ELEMENTS]).toEqual([mockPath, mockPath]);
  });

  it('selectAllElements should add the selectionRectangle path in the selected elements', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[PATH_DRAWING_SERVICE], 'setBasicAttributes');
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service.svgElement = {children: [mockPath] as unknown as HTMLCollection} as SVGElement;
    service[PATHS][SELECTION_RECTANGLE_INDEX] = mockPath;
    service[SELECT_ALL_ELEMENTS]();

    expect(service[SELECTED_ELEMENTS]).toEqual([]);
  });

  it('onArrowsChange should preventDefault and onArrowsChange if selectedElements isnt empty', () => {
    const mockKeyboardEvent = new KeyboardEvent('click');
    spyOn(mockKeyboardEvent, PREVENT_DEFAULT);
    spyOn(service[SELECTION_MOVEMENT_SERVICE], ON_ARROWS_CHANGE);

    service[SELECTED_ELEMENTS] = [mockPath];
    service.onArrowsChange(new Map(), mockKeyboardEvent);

    expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
    expect(service[SELECTION_MOVEMENT_SERVICE].onArrowsChange).toHaveBeenCalled();
  });

  it('onArrowsChange should not do anything if there is no selectedElements', () => {
    const mockKeyboardEvent = new KeyboardEvent('click');
    spyOn(mockKeyboardEvent, PREVENT_DEFAULT);
    spyOn(service[SELECTION_MOVEMENT_SERVICE], ON_ARROWS_CHANGE);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);

    service[SELECTED_ELEMENTS] = [];
    service.onArrowsChange(new Map(), mockKeyboardEvent);

    expect(mockKeyboardEvent.preventDefault).toHaveBeenCalledTimes(0);
    expect(service[SELECTION_MOVEMENT_SERVICE].onArrowsChange).toHaveBeenCalledTimes(0);
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalledTimes(0);
  });

  it('clearSelection should empty the selectedElements, reset all events and createTheBoudingBox if the main path has been created', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[SELECTED_ELEMENTS] = [mockPath];
    service[PATHS][SVG_INDEX] = mockPath;
    service.clearSelection();

    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
    expect(service[SELECTED_ELEMENTS]).toEqual([]);
    expect(service[EVENT_STARTED]).toEqual([false, false, false, false]);
  });

  it('clearSelection should not call createTheBoudingBox if the main path has not been created', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service.clearSelection();

    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalledTimes(0);
  });

  it('selectingElements should draw a rectangle, find all selectedElements and createTheBoudingBox', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[PATH_DRAWING_SERVICE], DRAW_RECTANGLE);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, FIND_ALL_SELECTED_ELEMENTS);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[POSITION] = [0, 0];
    service[SELECTED_ELEMENTS] = [mockPath];
    service[SELECTING_ELEMENTS](mockMouseEvent);

    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
    expect(service[FIND_ALL_SELECTED_ELEMENTS]).toHaveBeenCalled();
    expect(service[PATH_DRAWING_SERVICE].drawRectangle).toHaveBeenCalled();
  });

  it('isOnControlPoint should return false if the target is not the path for the control points', () => {
    service[PATHS][CONTROL_POINTS] = mockPath;

    expect(service[IS_ON_CONTROL_POINT](mockMouseEvent)).toBeFalsy();
  });

  it('initializePathArray should call create element 4 times if the length of the array is 0', () => {
    service[PATHS] = [];
    spyOn(service[RENDERER], CREATE_ELEMENT);

    service[INITIALIZE_PATH_ARRAY]();

    expect(service[RENDERER].createElement).toHaveBeenCalledTimes(CALL_TIMES_4);
  });

  it('initializePathArray should call  not create element if the length of the array is not 0', () => {
    service[PATHS] = [mockPath];
    spyOn(service[RENDERER], CREATE_ELEMENT);

    service[INITIALIZE_PATH_ARRAY]();

    expect(service[RENDERER].createElement).toHaveBeenCalledTimes(0);
  });

  it('eventHasStarted should return true if at least one of the three main event is true(has started)', () => {
    service[EVENT_STARTED][SELECTION] = true;
    expect(service[EVENT_HAS_STARTED]()).toBeTruthy();
  });

  it('eventHasStarted should return false if none of the three main event is true(has started)', () => {
    expect(service[EVENT_HAS_STARTED]()).toBeFalsy();
  });

  it('resetAllSelection should reset the array of selected elements', () => {
    service[SELECTED_ELEMENTS] = [mockPath];
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');
    service[RESET_ALL_SELECTION]();
    expect(service[SELECTED_ELEMENTS]).toEqual([]);
  });

  it('resetPath should reset all event, call createBoundingBoxRectangle and setPathString if a main event has started(is true)', () => {
    service[EVENT_STARTED][SELECTION] = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[PATH_DRAWING_SERVICE], SET_PATH_STRING);

    service[RESET_PATH]();

    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
    expect(service[PATH_DRAWING_SERVICE].setPathString).toHaveBeenCalled();
    expect(service[EVENT_STARTED]).toEqual([false, false, false, false]);
  });

  it('resetPath should noy call createBoundingBoxRectangle and setPathString if no main event has started(is true)', () => {
    service[EVENT_STARTED][SELECTION] = false;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[PATH_DRAWING_SERVICE], SET_PATH_STRING);

    service[RESET_PATH]();

    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalledTimes(0);
    expect(service[PATH_DRAWING_SERVICE].setPathString).toHaveBeenCalledTimes(0);
  });

  it('invertedSelection should call drawRectangle, findAllSelectedElements and createBoundingBoxRectangle', () => {
    spyOn(service[PATH_DRAWING_SERVICE], DRAW_RECTANGLE);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, FIND_ALL_SELECTED_ELEMENTS).and.returnValue([mockPath]);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[POSITION] = [0, 0];
    service[INVERTED_SELECTION_ELEMENTS] = [mockPath];
    service[INVERTED_SELECTION_FUNCTION](mockMouseEvent);

    expect(service[PATH_DRAWING_SERVICE].drawRectangle).toHaveBeenCalled();
    expect(service[FIND_ALL_SELECTED_ELEMENTS]).toHaveBeenCalled();
    expect(service[CREATE_BOUNDING_BOX]).toHaveBeenCalled();
  });

  it('invertedSelection should add element that are selected in selectedElements if they are not in invertedSelectionElements', () => {
    spyOn(service[PATH_DRAWING_SERVICE], DRAW_RECTANGLE);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, FIND_ALL_SELECTED_ELEMENTS).and.returnValue([mockPath]);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[POSITION] = [0, 0];
    service[INVERTED_SELECTION_ELEMENTS] = [];
    service[INVERTED_SELECTION_FUNCTION](mockMouseEvent);

    expect(service[SELECTED_ELEMENTS]).toEqual([mockPath]);
  });

  it('invertedSelection should delete element that are selected in selectedElements if they are in invertedSelectionElements', () => {
    spyOn(service[PATH_DRAWING_SERVICE], DRAW_RECTANGLE);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, FIND_ALL_SELECTED_ELEMENTS).and.returnValue([mockPath]);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, CREATE_BOUNDING_BOX);
    spyOn(service[SELECTED_ELEMENTS_SERVICE].selectedElements, 'next');

    service[POSITION] = [0, 0];
    service[INVERTED_SELECTION_ELEMENTS] = [mockPath];
    service[INVERTED_SELECTION_FUNCTION](mockMouseEvent);

    expect(service[SELECTED_ELEMENTS]).toEqual([]);
  });

  it('findAllSelectedElements should select elements that are in the selectionRectangle', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_IN_RECTANGLE).and.returnValue(true);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, GET_PATH_WIDTH);
    service.svgElement = {children: [mockPath, mockPath] as unknown as HTMLCollection} as SVGElement;

    const currentlySelectedElements = service[FIND_ALL_SELECTED_ELEMENTS]();
    expect(currentlySelectedElements).toEqual([mockPath]);
    expect(service[GET_PATH_WIDTH]).toHaveBeenCalledTimes(1);
  });

  it('findAllSelectedElements should not select elements that are not in the selectionRectangle', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_IN_RECTANGLE).and.returnValue(false);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, GET_PATH_WIDTH);
    service.svgElement = {children: [mockPath, mockPath] as unknown as HTMLCollection} as SVGElement;

    const currentlySelectedElements = service[FIND_ALL_SELECTED_ELEMENTS]();
    expect(currentlySelectedElements).toEqual([]);
    expect(service[GET_PATH_WIDTH]).toHaveBeenCalledTimes(1);
  });

  it('initializeSelectionRectangle should create the path if the path for the selection is undefined', () => {
    spyOn(service[RENDERER], CREATE_ELEMENT);
    spyOn(service[PATH_DRAWING_SERVICE], 'setBasicAttributes');
    spyOn(service[PATH_DRAWING_SERVICE], 'setPathString');
    spyOn(service[PATH_DRAWING_SERVICE], 'setPerimeterAttributes');

    service[POSITION] = [0, 0];
    service[INITIALIZE_SELECTION_RECTANGLE]();

    expect(service[RENDERER].createElement).toHaveBeenCalled();
  });

  it('initializeSelectionRectangle should call function from pathDrawingService to initialize the selectionr rectangle attributes', () => {
    spyOn(service[PATH_DRAWING_SERVICE], SET_PATH_STRING);
    spyOn(service[PATH_DRAWING_SERVICE], SET_PERIMETER_ATTRIBUTES);
    spyOn(service[PATH_DRAWING_SERVICE], SET_BASIC_ATTRIBUTES);
    service[PATHS][SELECTION_RECTANGLE_INDEX] = mockPath;
    service[POSITION] = [0, 0];
    service[INITIALIZE_SELECTION_RECTANGLE]();

    expect(service[PATH_DRAWING_SERVICE].setPathString).toHaveBeenCalled();
    expect(service[PATH_DRAWING_SERVICE].setPerimeterAttributes).toHaveBeenCalled();
    expect(service[PATH_DRAWING_SERVICE].setBasicAttributes).toHaveBeenCalledTimes(2);
  });

  it('initializeSelection should set the selection event to true, update the position and call InitializeSelectionRectangle', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, INITIALIZE_SELECTION_RECTANGLE);

    service[INITIALIZE_SELECTION](mockMouseEvent);

    expect(service[POSITION]).toEqual([mockMouseEvent.offsetX, mockMouseEvent.offsetY]);
    expect(service[EVENT_STARTED]).toEqual([true, false, false, false]);
    expect(service[INITIALIZE_SELECTION_RECTANGLE]).toHaveBeenCalled();
  });

  it('isInRectangle should return false if the boundingBox is not contact with the selection rectangle bbox', () => {
    const bbox = new DOMRect();
    service[PATHS][SELECTION_RECTANGLE_INDEX] = mockPath;
    mockPath.getBoundingClientRect.and.returnValue({ top: 1, bottom: 10,
      toJSON: () => null , height: 100, left: 2, width: 200, right: 202, x : 0, y : 0 });
    expect(service[IS_IN_RECTANGLE](bbox, 0)).toBeFalsy();
  });

  it('isInRectangle should return true if the boundingBox is in contact with the selection rectangle bbox', () => {
    const bbox = new DOMRect();
    const otherBbox = new DOMRect();
    expect(service[IS_IN_RECTANGLE](bbox, 1, otherBbox)).toBeTruthy();
  });

  it('isInRectangle should return false if the boundingBox is below the selection rectangle bbox', () => {
    const BOUNDING_BOX_POSITION = 150;

    const bbox = new DOMRect();
    spyOnProperty(bbox, 'bottom').and.returnValue(BOUNDING_BOX_POSITION);
    spyOnProperty(bbox, 'top').and.returnValue(BOUNDING_BOX_POSITION);
    spyOnProperty(bbox, 'left').and.returnValue(BOUNDING_BOX_POSITION);
    spyOnProperty(bbox, 'right').and.returnValue(BOUNDING_BOX_POSITION);
    service[PATHS][SELECTION_RECTANGLE_INDEX] = mockPath;
    mockPath.getBoundingClientRect.and.returnValue({ top: 0, bottom: 100,
      toJSON: () => null , height: 100, left: 0, width: 200, right: 200, x : 0, y : 0 });
    expect(service[IS_IN_RECTANGLE](bbox, 0)).toBeFalsy();
  });

  it('isInRectangle should return true if the right side of the bounding box touches the selection rectangle bbox', () => {
    const BOUNDING_BOX_POSITION_150 = 150;
    const BOUNDING_BOX_POSITION_50 = 50;

    const bbox = new DOMRect();
    spyOnProperty(bbox, 'bottom').and.returnValue(BOUNDING_BOX_POSITION_150);
    spyOnProperty(bbox, 'top').and.returnValue(BOUNDING_BOX_POSITION_50);
    spyOnProperty(bbox, 'left').and.returnValue(BOUNDING_BOX_POSITION_50);
    spyOnProperty(bbox, 'right').and.returnValue(BOUNDING_BOX_POSITION_150);
    service[PATHS][SELECTION_RECTANGLE_INDEX] = mockPath;
    mockPath.getBoundingClientRect.and.returnValue({ top: 0, bottom: 100,
      toJSON: () => null , height: 100, left: 100, width: 100, right: 200, x : 0, y : 0 });
    expect(service[IS_IN_RECTANGLE](bbox, 0)).toBeTruthy();
  });

  it('isInRectangle should return true if the right side of the bounding box touches the selection rectangle bbox', () => {
    const BOUNDING_BOX_POSITION_150 = 150;
    const BOUNDING_BOX_POSITION_50 = 50;
    const BOUNDING_BOX_POSITION_80 = 80;

    const bbox = new DOMRect();
    spyOnProperty(bbox, 'bottom').and.returnValue(BOUNDING_BOX_POSITION_150);
    spyOnProperty(bbox, 'top').and.returnValue(BOUNDING_BOX_POSITION_50);
    spyOnProperty(bbox, 'left').and.returnValue(BOUNDING_BOX_POSITION_50);
    spyOnProperty(bbox, 'right').and.returnValue(BOUNDING_BOX_POSITION_80);
    service[PATHS][SELECTION_RECTANGLE_INDEX] = mockPath;
    mockPath.getBoundingClientRect.and.returnValue({ top: 0, bottom: 100,
      toJSON: () => null , height: 100, left: 100, width: 100, right: 200, x : 0, y : 0 });
    expect(service[IS_IN_RECTANGLE](bbox, 0)).toBeFalsy();
  });
  it('getPathWidth should return half the stroke-width of the element if it exists', () => {
    mockPath.getAttribute.and.returnValue('10');
    expect(service[GET_PATH_WIDTH](mockPath)).toEqual(CALL_TIMES_5);
  });

  it('getPathWidth should return 0 if the stroke-width of the element doesnt exists', () => {
    mockPath.getAttribute.and.returnValue(undefined);
    expect(service[GET_PATH_WIDTH](mockPath)).toEqual(0);
  });

  it('createBoundingBoxRectangle should call setPathString on both path if there is not selectedElements', () => {
    spyOn(service[PATH_DRAWING_SERVICE], SET_PATH_STRING);

    service[SELECTED_ELEMENTS] = [];
    service[CREATE_BOUNDING_BOX]();

    expect(service[PATH_DRAWING_SERVICE].setPathString).toHaveBeenCalledTimes(2);
  });

  it('createBoundingBoxRectangle should call quadrilatorString and setPathString on both path if there is a selectedElements', () => {
    spyOn(service[PATH_DRAWING_SERVICE], 'quadrilatorString');

    spyOn(service[PATH_DRAWING_SERVICE], SET_PATH_STRING);

    mockPath.getBoundingClientRect.and.returnValue({ top: 1, bottom: 10,
      toJSON: () => null , height: 100, left: 2, width: 200, right: 202, x : 0, y : 0 });
    service[SELECTED_ELEMENTS] = [mockPath, mockPath];
    service[CREATE_BOUNDING_BOX]();

    expect(service[PATH_DRAWING_SERVICE].setPathString).toHaveBeenCalledTimes(2);
    expect(service[PATH_DRAWING_SERVICE].quadrilatorString).toHaveBeenCalled();
  });

  it('controlPointPathString should draw 4 rectangles', () => {
    spyOn(service[PATH_DRAWING_SERVICE], 'quadrilatorString');

    service[CONTROL_POINTS_PATH_STRING]([0, 0], [0, 0]);

    expect(service[PATH_DRAWING_SERVICE].quadrilatorString).toHaveBeenCalledTimes(CALL_TIMES_4);
  });

  it('mergeAllPath should call appendChild three times', () => {
    spyOn(service[RENDERER], APPEND_CHILD);

    service[MERGE_ALL_PATH]();

    expect(service[RENDERER].appendChild).toHaveBeenCalledTimes(CALL_TIMES_3);
  });

  it('elementToAdd should return null if the target isnt an instance of SVGPathElement', () => {
    const mockMouseTarget = jasmine.createSpyObj('mouseEvent', ['target']);
    mockMouseTarget.target.and.returnValue(null);
    expect(service[ELEMENT_TO_ADD](mockMouseTarget)).toBeNull();
  });

  it('elementToAdd should return the target if the target is the svg of the controlPoints', () => {
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const parentPath: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any --> to test private attribut
    spyOnProperty<any>(mockMouseEvent.target, 'parentElement').and.returnValue(parentPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any --> to test private attribut
    spyOnProperty<any>(parentPath, 'parentElement').and.returnValue(null);
    service[PATHS][CONTROL_POINTS] = path;
    expect(service[ELEMENT_TO_ADD](mockMouseEvent)).toEqual(path);
  });

  it('elementToAdd should return null if the parent of the target is null ', () => {
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(mockMouseEvent.target, 'parentElement').and.returnValue(null);
    expect(service[ELEMENT_TO_ADD](mockMouseEvent)).toBeNull();
  });

  it('elementToAdd should return the target if the parent element of the target is not null ', () => {
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(mockMouseEvent.target, 'parentElement').and.returnValue(path);
    expect(service[ELEMENT_TO_ADD](mockMouseEvent)).toEqual(path);
  });

  it('elementToAdd should return the target if the parent of the parent is not the svg', () => {
    const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const parentPath: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spyOnProperty(mockMouseEvent, 'target').and.returnValue(path);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(mockMouseEvent.target, 'parentElement').and.returnValue(parentPath);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOnProperty<any>(parentPath, 'parentElement').and.returnValue(null);
    expect(service[ELEMENT_TO_ADD](mockMouseEvent)).toEqual(path);
  });

  it('isInSelectedElementBox should call isInRectangle', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, IS_IN_RECTANGLE);
    service[PATHS][SELECTED_ELEMENT_PATH_INDEX] = mockPath;
    // spyOn(service[PATHS][SELECTED_ELEMENT_PATH_INDEX], 'getBoundingClientRect');
    service[IN_SELECTED_ELEMENT_BOX](mockMouseEvent);
    expect(service[IS_IN_RECTANGLE]).toHaveBeenCalled();
  });
// tslint:disable-next-line: max-file-line-count
});
