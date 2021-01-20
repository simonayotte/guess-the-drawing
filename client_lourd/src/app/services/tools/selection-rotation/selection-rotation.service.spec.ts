import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { SelectionRotationService } from './selection-rotation.service';

const RENDERER = 'renderer';
const ALT_IS_DOWN = 'altIsDown';
const SELF_CENTERED_ROTATION = 'selfCenteredRotation';
const SELF_CENTERED_ROTATE = 'selfCenteredRotate';
const SELECTION_CENTERED_ROTATE = 'selectionCenteredRotate';
const COMMAND_INVOKER = 'commandInvoker';
const CREATE_ROTATION_COMMAND = 'createRotationCommand';
const CURRENT_ROTATION_VALUE = 'currentRotationValue';
const SELECTED_ELEMENTS = 'selectedElements';
const INITIAL_ROTATE = 'initialRotate';
const UPDATE_ROTATION_ANGLE = 'updateRotationAngle';
const SELECTION_MANIPULATION_SERVICE = 'selectionManipulationService';
const TRANSLATE_ELEMENT = 'translateElement';
const ADD_ROTATION_STRING = 'addRotationString';
const RESET_TRANSFORM_STRING = 'resetTransformString';
const TRANSLATE_VALUE_FOR_ROTATION = 'translateValueForRotation';
const SELECTION_TOOL = 'selectionTool';

const BIG_ROTATION = 15;
const SMALL_ROTATION = 1;
const X = 0;
const Y = 1;

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
describe('SelectionRotationService', () => {
  let service: SelectionRotationService;
  const mockPath = jasmine.createSpyObj('mockPath', ['getAttribute']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SelectionRotationService]});
    service = TestBed.get(SelectionRotationService);
    service[RENDERER] = TestBed.get(Renderer2);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onAltDown should set altIsDown to true', () => {
    service[ALT_IS_DOWN] = false;
    service.onAltDown();
    expect(service[ALT_IS_DOWN]).toBeTruthy();
  });

  it('onAltUp should set altIsDown to false', () => {
    service[ALT_IS_DOWN] = true;
    service.onAltUp();
    expect(service[ALT_IS_DOWN]).toBeFalsy();
  });

  it('onShiftDown should set altIsDown to true', () => {
    service[SELF_CENTERED_ROTATION] = false;
    service.onShiftDown();
    expect(service[SELF_CENTERED_ROTATION]).toBeTruthy();
  });

  it('onShiftUp should set altIsDown to false', () => {
    service[SELF_CENTERED_ROTATION] = true;
    service.onShiftUp();
    expect(service[SELF_CENTERED_ROTATION]).toBeFalsy();
  });

  it('onMouseWheelMovement should call not selection/selfCenteredRotate if there is no selected element', () => {
    service[SELF_CENTERED_ROTATION] = false;
    service[SELECTED_ELEMENTS] = [];
    spyOn(service[SELECTION_TOOL], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'selectionCenteredRotate');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'selfCenteredRotate');
    service.onMouseWheelMovement(new WheelEvent('wheelEvent'));
    expect(service[SELECTION_CENTERED_ROTATE]).toHaveBeenCalledTimes(0);
    expect(service[SELF_CENTERED_ROTATE]).toHaveBeenCalledTimes(0);
  });

  it('onMouseWheelMovement should call selfCenteredRotate if selfCenteredRotation is true', () => {
    spyOn(service[SELECTION_TOOL], 'autoSaveDrawing');
    service[SELF_CENTERED_ROTATION] = true;
    service[SELECTED_ELEMENTS] = [mockPath, mockPath];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'selfCenteredRotate');
    service.onMouseWheelMovement(new WheelEvent('wheelEvent'));
    expect(service[SELF_CENTERED_ROTATE]).toHaveBeenCalled();
  });

  it('onMouseWheelMovement should call selectionCenteredRotate if selfCenteredRotation is false and there is more than one element', () => {
    spyOn(service[SELECTION_TOOL], 'autoSaveDrawing');
    service[SELF_CENTERED_ROTATION] = false;
    service[SELECTED_ELEMENTS] = [mockPath, mockPath];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'selectionCenteredRotate');
    service.onMouseWheelMovement(new WheelEvent('wheelEvent'));
    expect(service[SELECTION_CENTERED_ROTATE]).toHaveBeenCalled();
  });

  it('onMouseWheelMovement should call selectionCenteredRotate if selfCenteredRotation is false and there is one element', () => {
    spyOn(service[SELECTION_TOOL], 'autoSaveDrawing');
    service[SELF_CENTERED_ROTATION] = false;
    service[SELECTED_ELEMENTS] = [mockPath];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'selfCenteredRotate');
    service.onMouseWheelMovement(new WheelEvent('wheelEvent'));
    expect(service[SELF_CENTERED_ROTATE]).toHaveBeenCalled();
  });

  it('intializeRenderer should set the value of the renderer of the service to the one in parameter', () => {
    const mockRenderer = service[RENDERER];
    service.initializeRenderer(mockRenderer);
    expect(service[RENDERER]).toBe(mockRenderer);
  });

  it('createRotationCommand should add a command in the commande invoker', () => {
    spyOn(service[COMMAND_INVOKER], 'addCommand');
    service[CREATE_ROTATION_COMMAND](0);
    expect(service[COMMAND_INVOKER].addCommand).toHaveBeenCalled();
  });

  it('currentRotation value should return a big rotation if alt is not down and the rotation is clockwise', () => {
    service[ALT_IS_DOWN] = false;
    expect(service[CURRENT_ROTATION_VALUE](true)).toBe(BIG_ROTATION);
  });

  it('currentRotation value should return a negative big rotation if alt is not down and the rotation is not clockwise', () => {
    service[ALT_IS_DOWN] = false;
    expect(service[CURRENT_ROTATION_VALUE](false)).toBe(-BIG_ROTATION);
  });

  it('currentRotation value should return 1 if alt is down and the rotation is clockwise', () => {
    service[ALT_IS_DOWN] = true;
    expect(service[CURRENT_ROTATION_VALUE](true)).toBe(SMALL_ROTATION);
  });

  it('currentRotation value should return -1 if alt is not down and the rotation is not clockwise', () => {
    service[ALT_IS_DOWN] = true;
    expect(service[CURRENT_ROTATION_VALUE](false)).toBe(-SMALL_ROTATION);
  });

  it('initialRotate should getAttribute for each selectedElements', () => {
    const path = jasmine.createSpyObj('mockPath', ['getAttribute']);
    mockPath.getAttribute.and.returnValue(null);
    service[SELECTED_ELEMENTS] = [path, path];
    service[INITIAL_ROTATE]();
    expect(path.getAttribute).toHaveBeenCalledTimes(2);
  });

  it('initialRotate should not setAttribute if the selectedElement already has a rotation angle', () => {
    mockPath.getAttribute.and.returnValue(1);
    service[SELECTED_ELEMENTS] = [mockPath];
    spyOn(service[RENDERER], 'setAttribute');
    service[INITIAL_ROTATE]();
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(0);
  });

  it('updateRotationAngle should call getAttribute and setAttribute on the element', () => {
    mockPath.getAttribute.and.returnValue(1);
    spyOn(service[RENDERER], 'setAttribute');
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'updateRotation');
    service[UPDATE_ROTATION_ANGLE](mockPath, 0);
    expect(mockPath.getAttribute).toHaveBeenCalled();
  });

  it('updateRotationAngle should call updateRotation on selectionManipulationService', () => {
    mockPath.getAttribute.and.returnValue(null);
    spyOn(service[RENDERER], 'setAttribute');
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'updateRotation');
    service[UPDATE_ROTATION_ANGLE](mockPath, 0);
    expect(service[SELECTION_MANIPULATION_SERVICE].updateRotation).toHaveBeenCalled();
  });

  it('onMouseWheelMovement should call currentRotationValue and create a rotation command if there is selected elements', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'currentRotationValue');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'createRotationCommand');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'selfCenteredRotate');
    spyOn(service[SELECTION_TOOL], 'autoSaveDrawing');
    service[SELECTED_ELEMENTS] = [mockPath];
    service.onMouseWheelMovement(new WheelEvent('mock'));
    expect(service[CURRENT_ROTATION_VALUE]).toHaveBeenCalled();
    expect(service[CREATE_ROTATION_COMMAND]).toHaveBeenCalled();
  });

  it('selfCenteredRotate should call updateRotationAngle for each selected element', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'currentRotationValue');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'createRotationCommand');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'updateRotationAngle');
    mockPath.getAttribute.and.returnValue(1);
    service[SELECTED_ELEMENTS] = [mockPath];
    service[SELF_CENTERED_ROTATE](0);
    expect(service[UPDATE_ROTATION_ANGLE]).toHaveBeenCalled();
  });

  it('translateElement should call getAttribute to get the transform attribute', () => {
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'deleteLastRotate');
    service[TRANSLATE_ELEMENT](mockPath, '');
    expect(mockPath.getAttribute).toHaveBeenCalled();
  });

  it('translateElement should delete the last rotate if the transform string exist and then set the new transform string', () => {
    mockPath.getAttribute.and.returnValue('test');
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'deleteLastRotate');
    spyOn(service[RENDERER], 'setAttribute');
    service[TRANSLATE_ELEMENT](mockPath, '');
    expect(service[SELECTION_MANIPULATION_SERVICE].deleteLastRotate).toHaveBeenCalled();
    expect(service[RENDERER].setAttribute).toHaveBeenCalled();
  });

  it('translateElement should not delete the last rotate if the transform string does not exist', () => {
    mockPath.getAttribute.and.returnValue(null);
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'deleteLastRotate');
    spyOn(service[RENDERER], 'setAttribute');
    service[TRANSLATE_ELEMENT](mockPath, '');
    expect(service[SELECTION_MANIPULATION_SERVICE].deleteLastRotate).toHaveBeenCalledTimes(0);
    expect(service[RENDERER].setAttribute).toHaveBeenCalled();
  });

  it('selectionCenteredRotate should get the center of the selection', () => {
    spyOn(service[SELECTION_MANIPULATION_SERVICE],  'getCenterPositionOfAllElements');
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'updateRotation');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'translateElement');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'translateValueForRotation').and.returnValue([0, 0]);
    service[SELECTION_CENTERED_ROTATE](0, [mockPath]);
    expect(service[SELECTION_MANIPULATION_SERVICE].getCenterPositionOfAllElements).toHaveBeenCalled();
  });

  it('selectionCenteredRotate should get the center of each selected elements and translate every one of them', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'translateValueForRotation').and.returnValue([0, 0]);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'updateRotationAngle');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'translateElement');
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'updateRotation');
    service[SELECTED_ELEMENTS] = [mockPath, mockPath];
    spyOn(service[SELECTION_MANIPULATION_SERVICE],  'getCenterPositionOfAllElements');
    service[SELECTION_CENTERED_ROTATE](0, [mockPath, mockPath]);
    expect(service[SELECTION_MANIPULATION_SERVICE].getCenterPositionOfAllElements).toHaveBeenCalled();
  });

  it('addRotationString should call deleteLastRotate and setAttribute if the transformString is not null', () => {
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'deleteLastRotate');
    spyOn(service[RENDERER], 'setAttribute');
    service[ADD_ROTATION_STRING](mockPath, 'transform', 'rotation');
    expect(service[SELECTION_MANIPULATION_SERVICE].deleteLastRotate).toHaveBeenCalled();
    expect(service[RENDERER].setAttribute).toHaveBeenCalled();
  });

  it('addRotationString should call setAttribute but not deleteLastRotate if the transformString is null', () => {
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'deleteLastRotate');
    spyOn(service[RENDERER], 'setAttribute');
    service[ADD_ROTATION_STRING](mockPath, null, 'rotation');
    expect(service[SELECTION_MANIPULATION_SERVICE].deleteLastRotate).toHaveBeenCalledTimes(0);
    expect(service[RENDERER].setAttribute).toHaveBeenCalled();
  });

  it('resetTransformString should call setAttribute if the old string is not null', () => {
    spyOn(service[RENDERER], 'setAttribute');
    service[RESET_TRANSFORM_STRING](mockPath, ' ');
    expect(service[RENDERER].setAttribute).toHaveBeenCalled();
  });

  it('resetTransformString should call setAttribute if the oldString is null', () => {
    spyOn(service[RENDERER], 'setAttribute');
    service[RESET_TRANSFORM_STRING](mockPath, null);
    expect(service[RENDERER].setAttribute).toHaveBeenCalled();
  });

  it('translateValueForRotation should call addRotationString, resetTransformString and get the center of the element', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'addRotationString');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'resetTransformString');
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'getCenterPositionOfElement').and.returnValue([0, 0]);
    service[TRANSLATE_VALUE_FOR_ROTATION](mockPath, [0, 0], 0);
    expect(service[ADD_ROTATION_STRING]).toHaveBeenCalled();
    expect(service[RESET_TRANSFORM_STRING]).toHaveBeenCalled();
    expect(service[SELECTION_MANIPULATION_SERVICE].getCenterPositionOfElement).toHaveBeenCalledTimes(2);
  });

  it('translateValueForRotation should return the difference between the final and initial position', () => {
    const initialPosition: [number, number] = [0, 0];
    // We disabled this rule to test our function
    // tslint:disable-next-line: no-magic-numbers
    const finalPosition: [number, number] = [100, 100];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'addRotationString');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'resetTransformString');
    spyOn(service[SELECTION_MANIPULATION_SERVICE], 'getCenterPositionOfElement').and.returnValues(finalPosition, initialPosition);
    expect( service[TRANSLATE_VALUE_FOR_ROTATION](mockPath, [0, 0], 0)).toEqual([finalPosition[X] - initialPosition[X],
                                                                                finalPosition[Y] - initialPosition[Y]]);
  });
});
