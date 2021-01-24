import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { EraserService } from './eraser.service';
import { TranslateReader } from './translate-reader';

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

describe('EraserServiceService', () => {
  let service: EraserService;
  const AREA_TRIANGLE = 'areaTriangle';
  const COORDS_TO_DOMPOINT = 'coordsToDomPoint';
  const FILLED_PATH_TO_CHECK  = 'filledPathToCheck';
  const RENDERER = 'renderer';
  const ADD_MULTIPLE_PATH = 'addMultiplePath';
  const POINTS_FROM_PATHS = 'pointsFromPaths';
  const ADD_SINGLE_PATH = 'addSinglePath';
  const REVERT_SELECTED_PATH = 'revertSelectedPath';
  const CHECK_IF_RADIUS_INTERSECT = 'checkIfRadiusIntersect';
  const HANDLE_COLLISION = 'handleCollision';
  const IS_ERASING = 'isErasing';
  const REMOVE_PATH = 'removePath';
  const PATH_TO_REMOVE = 'pathToRemove';
  const SET_PATH_TO_SELECTED = 'setPathToSelected';
  const MOUSE_IS_STILL_IN_COLL = 'mouseIsStillInCollision';
  const PATH_DRAWING_SERVICE = 'pathDrawingService';
  const CONSTRUCT_ERASER_PATH = 'constructEraserPath';
  const RED_PATH = 'redPath';
  const FORCE_REVERT = 'forceRevert';
  const SET_REMOVE_CALLBACK = 'setRemoveCallBack';
  const CALL_BACK_FUNCTION = 'callBackFunctionToRemoveEraser';
  const DETERMINENEWWIDTHSIZE = 'determineNewWidthSize';
  const ON_MOUSE_ENTER = 'onMouseEnter';
  const COMMAND_INVOKER = 'commandInvoker';
  const MOUSE_IS_IN_DRAWING = 'mouseIsInDrawing';
  const PATH = 'path';
  const width = 5;
  /* tslint:disable */
  // I Desactived the ts-lint to be able to create three fake points with fake values without creating 9 variables for the magic numbers
  const DOMPOINT_A = new DOMPoint(10, 30);
  const DOMPOINT_B = new DOMPoint(20, 30);
  const DOMPOINT_C = new DOMPoint(15, 90);
  /* tslint:enable */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Renderer2, useClass: MockRenderer2}]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [EraserService] });
    service = TestBed.get(EraserService);
    service[RENDERER] = TestBed.get(Renderer2);
    spyOn(TranslateReader, 'readTransform').and.returnValue(DOMPOINT_A);
  });
  
  it('onmousemove should construct eraserpath  and handlecollision', () => {
    const mockMouseEvent = new MouseEvent('mouseEvent');
    service[CONSTRUCT_ERASER_PATH] = jasmine.createSpy().and.callFake(() => {return; });
    service[HANDLE_COLLISION] = jasmine.createSpy().and.callFake(() => {return; });
    service.onMouseMove(mockMouseEvent);
    expect(service[CONSTRUCT_ERASER_PATH]).toHaveBeenCalled();
    expect(service[HANDLE_COLLISION]).toHaveBeenCalled();
  });
  it('initialize renderer', () => {
    service.initializeRenderer(service[RENDERER]);
    expect(service[RENDERER]).toBe(service[RENDERER]);
  });
  
  it('addPath should call single path if no children', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    path.getAttribute = jasmine.createSpy().and.returnValue('rectangle');
    path.hasChildNodes = jasmine.createSpy().and.returnValue(false);
    service[ADD_SINGLE_PATH] = jasmine.createSpy().and.callFake(() => {return; });
    service.addPath(path);
    expect(service[ADD_SINGLE_PATH]).toHaveBeenCalled();
  });

  it('addPath should multiple path if children', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    path.getAttribute = jasmine.createSpy().and.returnValue('rectangle');
    path.hasChildNodes = jasmine.createSpy().and.returnValue(true);
    service[ADD_MULTIPLE_PATH] = jasmine.createSpy().and.callFake(() => {return; });
    service.addPath(path);
    expect(service[ADD_MULTIPLE_PATH]).toHaveBeenCalled();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('removepath should filter points from path and filledpathtocheck', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    service[POINTS_FROM_PATHS].push([DOMPOINT_A, path, width]);
    service[FILLED_PATH_TO_CHECK].push([path, DOMPOINT_A]);
    service.removePath(path);
    expect(service[POINTS_FROM_PATHS].length).toBe(0);
    expect(service[FILLED_PATH_TO_CHECK].length).toBe(0);
  });
  it('onMouseDownInElement should set this.iserasing to true and call handlecollision', () => {
    let mockMouseEvent = new MouseEvent('mouseEvent');
    mockMouseEvent = jasmine.createSpyObj('mock', ['offsetX', 'offsetY']);
    service[HANDLE_COLLISION] = jasmine.createSpy().and.callFake(() => {return; });
    service.onMouseDownInElement(mockMouseEvent);
    expect(service[IS_ERASING]).toBeTruthy();
    expect(service[HANDLE_COLLISION]).toHaveBeenCalled();
  });
  it('onMouesUp should set this.erasing to false and create command and execute it', () => {
    const mockMouseEvent = new MouseEvent('mouseEvent');
    const path: SVGPathElement = {} as SVGPathElement;

    service[MOUSE_IS_IN_DRAWING] = true;
    service[PATH_TO_REMOVE].push(path);
    service[COMMAND_INVOKER].execute = jasmine.createSpy().and.callFake(() => {return; });
    service.onMouseUp(mockMouseEvent);
    expect(service[IS_ERASING]).toBeFalsy();
    expect(service[COMMAND_INVOKER].execute).toHaveBeenCalled();
  });
  it('onMouesUp should set this.erasing to false and create command and execute it', () => {
    const mockMouseEvent = new MouseEvent('mouseEvent');
    service[MOUSE_IS_IN_DRAWING] = true;
    service[COMMAND_INVOKER].execute = jasmine.createSpy().and.callFake(() => {return; });
    service.onMouseUp(mockMouseEvent);
    expect(service[IS_ERASING]).toBeFalsy();
    expect(service[COMMAND_INVOKER].execute).not.toHaveBeenCalled();
  });
  it('onMouesUp should trhow and error if mouse is not in drawing', () => {
    const mockMouseEvent = new MouseEvent('mouseEvent');
    service[MOUSE_IS_IN_DRAWING] = false;
    expect( () =>  {
      service.onMouseUp(mockMouseEvent);
    }).toThrowError('The eraser is not in the drawing');
  });
  it('onMouseLeave should remove eraser path and set mouseIsDrawing false', () => {
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service[CONSTRUCT_ERASER_PATH] = jasmine.createSpy().and.callFake(() => {return; });
    service.onMouseUp = jasmine.createSpy().and.callFake(() => {return; });
    service[CALL_BACK_FUNCTION] = (() => {return; });
    service[CALL_BACK_FUNCTION] = jasmine.createSpy().and.callFake(() => {return; });
    const mockMouseEvent = new MouseEvent('mouseEvent');
    try {
      service.onMouseLeave(mockMouseEvent);
    } catch (error) {
      expect(service[CALL_BACK_FUNCTION]).toHaveBeenCalled();
      expect(service.onMouseUp).toHaveBeenCalled();
      expect(service[MOUSE_IS_IN_DRAWING]).toBeFalsy();
      expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
    }
  });
  it('onMouseEnter should construct eraser path and set mouseIsDrawing true', () => {
    service[CONSTRUCT_ERASER_PATH] = jasmine.createSpy().and.callFake(() => {return; });
    const mockMouseEvent = new MouseEvent('mouseEvent');
    service[ON_MOUSE_ENTER](mockMouseEvent);
    expect(service[CONSTRUCT_ERASER_PATH]).toHaveBeenCalled();
    expect(service[MOUSE_IS_IN_DRAWING]).toBeTruthy();
  });
  it('expect setcalbback to set the callback', () => {
    const callback = 'callbackFunction';
    service[SET_REMOVE_CALLBACK](callback);
    expect(service[CALL_BACK_FUNCTION]).toBe(callback);
  });
  it('setPathToSelected should force revert and setAttribute', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const pathSelected: SVGPathElement = {} as SVGPathElement;
    const LAST_RED_COLOR = 'lastRedColor';
    service[LAST_RED_COLOR] = 'rgba(255, 0, 0, 1)';
    service[RED_PATH] = [path, 'red', '2'];
    pathSelected.getAttribute = jasmine.createSpy().and.callFake(() => 'ligne');
    pathSelected.setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].getAttribute = jasmine.createSpy().and.callFake(() => 'blue');
    service[SET_PATH_TO_SELECTED](pathSelected);
    expect(pathSelected.getAttribute).toHaveBeenCalled();
    expect(pathSelected.setAttribute).toHaveBeenCalled();
    expect(service[RED_PATH][0].setAttribute).toHaveBeenCalled();
    expect(service[RED_PATH][0].getAttribute).toHaveBeenCalled();
  });
  it('setPathToSelected should not force revert and setAttribute', () => {
    const pathSelected: SVGPathElement = {} as SVGPathElement;
    const LAST_RED_COLOR = 'lastRedColor';
    service[LAST_RED_COLOR] = 'rgba(255, 0, 0, 1)';
    service[RED_PATH] = [pathSelected, 'rgba(255, 0, 0, 1)', '2'];
    pathSelected.getAttribute = jasmine.createSpy().and.callFake(() => 'rgba(255, 0, 0, 1)');
    service[RED_PATH][0].getAttribute = jasmine.createSpy().and.callFake(() => 'rgba(255, 0, 0, 1)');
    service[DETERMINENEWWIDTHSIZE] = jasmine.createSpy().and.callFake(() => {return; });
    pathSelected.setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[SET_PATH_TO_SELECTED](pathSelected);
    expect(pathSelected.setAttribute).not.toHaveBeenCalled();
  });
  it('setPathToSelected should set selected color to darker red if paths color is red', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const pathSelected: SVGPathElement = {} as SVGPathElement;
    const LAST_RED_COLOR = 'lastRedColor';
    service[LAST_RED_COLOR] = 'rgba(255, 0, 0, 1)';
    service[RED_PATH] = [path, 'red', '2'];
    pathSelected.getAttribute = jasmine.createSpy().and.callFake(() => 'rgba(255, 0, 0, 1)');
    pathSelected.setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].getAttribute = jasmine.createSpy().and.callFake(() => 'blue');
    service[SET_PATH_TO_SELECTED](pathSelected);
    expect(pathSelected.getAttribute).toHaveBeenCalled();
    expect(pathSelected.setAttribute).toHaveBeenCalled();
    expect(service[RED_PATH][0].setAttribute).toHaveBeenCalled();
    expect(service[RED_PATH][0].getAttribute).toHaveBeenCalled();
    expect(service[LAST_RED_COLOR]).toBe('rgba(139, 0, 0, 1)');
  });
  it('setPathToSelected should force revert and setAttribute', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const pathSelected: SVGPathElement = {} as SVGPathElement;

    service[RED_PATH] = [path, '', '2'];
    pathSelected.getAttribute = jasmine.createSpy().and.callFake(() => 'rectangle');
    pathSelected.setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].getAttribute = jasmine.createSpy().and.callFake(() => 'blue');
    service[SET_PATH_TO_SELECTED](pathSelected);
    expect(pathSelected.getAttribute).toHaveBeenCalled();
    expect(pathSelected.setAttribute).toHaveBeenCalled();
    expect(service[RED_PATH][0].setAttribute).toHaveBeenCalled();
    expect(service[RED_PATH][0].getAttribute).toHaveBeenCalled();
  });
  it('setPathToSelected should force revert and setAttribute', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const pathSelected: SVGPathElement = {} as SVGPathElement;

    service[RED_PATH] = [path, '', '2'];
    pathSelected.getAttribute = jasmine.createSpy().and.callFake(() => null);
    pathSelected.setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].getAttribute = jasmine.createSpy().and.callFake(() => 'blue');
    service[SET_PATH_TO_SELECTED](pathSelected);
    expect(pathSelected.getAttribute).toHaveBeenCalled();
  });
  it('setPathToSelected should force revert and setAttribute', () => {
    const pathSelected: SVGPathElement = {} as SVGPathElement;

    service[RED_PATH] = [pathSelected, '', '2'];
    pathSelected.getAttribute = jasmine.createSpy().and.callFake(() => null);
    pathSelected.setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].getAttribute = jasmine.createSpy().and.callFake(() => 'red');
    service[SET_PATH_TO_SELECTED](pathSelected);
    expect(pathSelected.getAttribute).toHaveBeenCalled();
  });
  it('determineNewWidth should add 4 to the thickness', () => {
    const NEW_SIZE = '6';
    expect(service[DETERMINENEWWIDTHSIZE]('2')).toBe(NEW_SIZE);

  });
  it('forceRevert should revert the redpath even if there is a collision', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    service[RED_PATH] = [path, 'red', '2'];
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[FORCE_REVERT]();
    expect(service[RED_PATH][0].setAttribute).toHaveBeenCalled();
  });
  it('forceRevert should revert the redpath even if there is a collision', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    service[RED_PATH][0] = path;
    service[RED_PATH][2] = '2';
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[FORCE_REVERT]();
    expect(service[RED_PATH][1]).toBe('');
  });
  it('revertSelectedPath should revert path if no collision is detected with last selected Path (redPath)', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const X_POS = 10; const Y_POS = 20;
    service[RED_PATH] = [path, 'red', '2'];
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].getAttribute = jasmine.createSpy().and.callFake(() => 'ligne');
    service[MOUSE_IS_STILL_IN_COLL] = jasmine.createSpy().and.returnValue(false);
    service[REVERT_SELECTED_PATH]([X_POS, Y_POS]);
    expect(service[RED_PATH][0].setAttribute).toHaveBeenCalled();
  });
  it('revertSelectedPath should revert path if no collision is detected with last selected Path (redPath)', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const X_POS = 10; const Y_POS = 20;
    service[RED_PATH] = [path, 'red', '2'];
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].getAttribute = jasmine.createSpy().and.callFake(() => 'allo');
    service[MOUSE_IS_STILL_IN_COLL] = jasmine.createSpy().and.returnValue(false);
    service[REVERT_SELECTED_PATH]([X_POS, Y_POS]);
    expect(service[RED_PATH][0].setAttribute).toHaveBeenCalled();
  });
  it('revertSelectedPath should revert path if no collision is detected with last selected Path (redPath)', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const X_POS = 10; const Y_POS = 20;
    service[RED_PATH] = [path, 'red', '2'];
    service[RED_PATH][0].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[RED_PATH][0].getAttribute = jasmine.createSpy().and.callFake(() => 'allo');
    service[MOUSE_IS_STILL_IN_COLL] = jasmine.createSpy().and.returnValue(true);
    service[REVERT_SELECTED_PATH]([X_POS, Y_POS]);
    expect(service[RED_PATH][0].setAttribute).not.toHaveBeenCalled();
  });
  it('construct eraser path should set all attributes correctly', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    service[PATH] = path;
    const mockMouseEvent = new MouseEvent('mouseEvent');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service.eraserSize, 'value').and.returnValue(1);
    service[RENDERER].createElement = jasmine.createSpy().and.returnValue(path);
    service[PATH_DRAWING_SERVICE].setBasicAttributes = jasmine.createSpy().and.callFake(() => {return; });
    service[PATH_DRAWING_SERVICE].drawRectangle = jasmine.createSpy().and.callFake(() => {return; });
    service[PATH].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service.pathDoesNotExists = jasmine.createSpy().and.returnValue(true);
    service[CONSTRUCT_ERASER_PATH](mockMouseEvent);
    expect(service[RENDERER].createElement).toHaveBeenCalled();
    expect(service[PATH].setAttribute).toHaveBeenCalled();
    expect(service[PATH_DRAWING_SERVICE].setBasicAttributes).toHaveBeenCalled();
    expect(service[PATH_DRAWING_SERVICE].drawRectangle).toHaveBeenCalled();
  });
  it('construct eraser path should set all attributes correctly', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    service[PATH] = path;
    const mockMouseEvent = new MouseEvent('mouseEvent');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service.eraserSize, 'value').and.returnValue(1);
    service.pathDoesNotExists = jasmine.createSpy().and.returnValue(false);
    service[RENDERER].createElement = jasmine.createSpy().and.callFake(() => {return; });
    service[PATH_DRAWING_SERVICE].setBasicAttributes = jasmine.createSpy().and.callFake(() => {return; });
    service[PATH_DRAWING_SERVICE].drawRectangle = jasmine.createSpy().and.callFake(() => {return; });
    service[PATH].setAttribute = jasmine.createSpy().and.callFake(() => {return; });
    service[CONSTRUCT_ERASER_PATH](mockMouseEvent);
    expect(service[RENDERER].createElement).not.toHaveBeenCalled();
  });
  it('should createElement if path does not exists', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    expect(service.pathDoesNotExists()).toBe(true);
    service[PATH] = path;
    expect(service.pathDoesNotExists()).toBeFalsy();
  });
  it('MouseIsStillInCollision should return false if the hit is not with the selected Path and true if the hit is w path', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const X_POS = 10; const Y_POS = 20;
    service[POINTS_FROM_PATHS].push([DOMPOINT_A, path, width]);
    service[POINTS_FROM_PATHS].push([DOMPOINT_B, path, width]);
    service[RED_PATH][0] = path;
    service[CHECK_IF_RADIUS_INTERSECT] = jasmine.createSpy().and.returnValue(false);
    expect(service[MOUSE_IS_STILL_IN_COLL]([X_POS, Y_POS], path)).toBeFalsy();
    service[CHECK_IF_RADIUS_INTERSECT] = jasmine.createSpy().and.returnValue(true);
    expect(service[MOUSE_IS_STILL_IN_COLL]([X_POS, Y_POS], path)).toBeTruthy();
  });
  it('if the eraser is not erasing, the handling of collision should be different', () => {
    const X_POS = 10; const Y_POS = 20;
    const path: SVGPathElement = {} as SVGPathElement;
    service[POINTS_FROM_PATHS] = [[DOMPOINT_A, path, width]];
    const SPY_ON_REMOVE = spyOn(service, REMOVE_PATH).and.callFake(() => { return; });
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    const SPY_ON_SELECTED = spyOn<any>(service, SET_PATH_TO_SELECTED).and.callFake(() => { return; });
    service[PATH_TO_REMOVE].push = jasmine.createSpy().and.callFake(() => {return; });
    service[IS_ERASING] = true;
    service[CHECK_IF_RADIUS_INTERSECT] = jasmine.createSpy().and.returnValue(true);
    service[REVERT_SELECTED_PATH] = jasmine.createSpy();
    service[HANDLE_COLLISION]([X_POS, Y_POS]);
    expect(service[PATH_TO_REMOVE].push).toHaveBeenCalled();
    expect(SPY_ON_REMOVE).toHaveBeenCalled();
    expect(SPY_ON_SELECTED).toHaveBeenCalled();
  });
  it('if the eraser is not erasing, the handling of collision should be different', () => {
    const X_POS = 10; const Y_POS = 20;
    const path: SVGPathElement = {} as SVGPathElement;
    service[POINTS_FROM_PATHS] = [[DOMPOINT_A, path, width]];
    const SPY_ON_REMOVE = spyOn(service, REMOVE_PATH).and.callFake(() => { return; });
    service[REMOVE_PATH] = jasmine.createSpy().and.callFake(() => {return; });
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    const SPY_ON_SELECTED = spyOn<any>(service, SET_PATH_TO_SELECTED).and.callFake(() => { return; });
    service[IS_ERASING] = false;
    service[CHECK_IF_RADIUS_INTERSECT] = jasmine.createSpy().and.returnValue(true);
    service[REVERT_SELECTED_PATH] = jasmine.createSpy();
    service[HANDLE_COLLISION]([X_POS, Y_POS]);
    expect(SPY_ON_REMOVE).not.toHaveBeenCalled();
    expect(SPY_ON_SELECTED).toHaveBeenCalled();
  });
  it('handle collision should revert selected path if no collisions happenend', () => {
    const X_POS = 10; const Y_POS = 20;
    const path: SVGPathElement = {} as SVGPathElement;
    service[POINTS_FROM_PATHS].push([DOMPOINT_A, path, width]);
    service[CHECK_IF_RADIUS_INTERSECT] = jasmine.createSpy().and.returnValue(false);
    service[REVERT_SELECTED_PATH] = jasmine.createSpy();
    service[HANDLE_COLLISION]([X_POS, Y_POS]);
    expect(service[REVERT_SELECTED_PATH]).toHaveBeenCalled();
  });
  it('handle collision should not revert selected path if collisions happenend', () => {
    const X_POS = 10; const Y_POS = 20;
    service[IS_ERASING] = true;
    const path: SVGPathElement = {} as SVGPathElement;
    service[POINTS_FROM_PATHS].push([DOMPOINT_A, path, width]);
    service[CHECK_IF_RADIUS_INTERSECT] = jasmine.createSpy().and.returnValue(true);
    service[SET_PATH_TO_SELECTED] = jasmine.createSpy().and.callFake(() => {return; });
    service[REMOVE_PATH] = jasmine.createSpy().and.callFake(() => {return; });
    service[HANDLE_COLLISION]([X_POS, Y_POS]);
    expect(service[REMOVE_PATH]).toHaveBeenCalled();
  });
  it('checkIfRadiusIntersect should return true if two points and their radius intersect', () => {
    const X_POS = 10; const Y_POS = 20;
    const SIZE_ERASER = 10;
    const PATH_THICKNESS = 25;
    const path: SVGPathElement = {} as SVGPathElement;
    spyOn(service.eraserSize, 'getValue').and.returnValue(SIZE_ERASER);
    path.getAttribute = jasmine.createSpy().and.returnValue(PATH_THICKNESS);
    expect(service[CHECK_IF_RADIUS_INTERSECT]([X_POS, Y_POS], [DOMPOINT_A, path, PATH_THICKNESS])).toBeTruthy();
  });
  it('add single path should add points to pointsFromPaths', () => {
    const ADD_M_POINTS = 'addMPoints';
    const path: SVGPathElement = {} as SVGPathElement;
    const TOTAL_LENGTH = 3;
    const unshiftspy = spyOn(service[POINTS_FROM_PATHS], 'unshift');
    path.getAttribute = jasmine.createSpy().and.callFake(() => 1);
    service[ADD_M_POINTS] = jasmine.createSpy().and.callFake(() => {return; });
    path.getTotalLength = jasmine.createSpy().and.returnValue(TOTAL_LENGTH);
    path.getPointAtLength = jasmine.createSpy().and.returnValue(2);
    service[ADD_SINGLE_PATH](path);
    expect(unshiftspy).toHaveBeenCalledTimes(TOTAL_LENGTH);
  });
  it('add mutiple path should add points to pointsFromPaths', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const ADD_M_POINTS = 'addMPoints';
    const NB_PATH = 3;
    const TOTAL_LENGTH = 3;
    const spyArray = spyOn(Array, 'from').and.returnValue([path, path, path]);
    const unshiftspy = spyOn(service[POINTS_FROM_PATHS], 'unshift');
    path.getAttribute = jasmine.createSpy().and.callFake(() => 1);
    service[ADD_M_POINTS] = jasmine.createSpy().and.callFake(() => {return; });
    path.getTotalLength = jasmine.createSpy().and.returnValue(TOTAL_LENGTH);
    path.getPointAtLength = jasmine.createSpy().and.returnValue(2);
    service[ADD_MULTIPLE_PATH](path);
    expect(spyArray).toHaveBeenCalled();
    expect(unshiftspy).toHaveBeenCalledTimes(TOTAL_LENGTH * NB_PATH);
  });
  it('expect coordsToDomPoint to return a domPoint', () => {
    const x = 10;
    const y = 35;
    const coords: [number, number] = [x, y];
    const domPoint: DOMPoint = service[COORDS_TO_DOMPOINT](coords);
    expect(domPoint.x).toBe(x);
    expect(domPoint.y).toBe(y);
  });
  it('expect areaTriangle to return the good area for the given points', () => {
    const EXPECTED_VALUE = 300;
    const area = service[AREA_TRIANGLE](DOMPOINT_A, DOMPOINT_B, DOMPOINT_C);
    expect(area).toBe(EXPECTED_VALUE);
  });
  it('refresh transform should find the path and add the new transform', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const selectedElement = [path, path, path];
    const xTransform = 10;
    const yTransform = 10;
    const FINAL_X = 40;
    const FINAL_Y  = 40;
    const DOMPOINT = new DOMPoint(xTransform, yTransform);
    service[POINTS_FROM_PATHS] = [[DOMPOINT, path, width], [DOMPOINT, path, width]];
    service[FILLED_PATH_TO_CHECK] = [[path, DOMPOINT], [path, DOMPOINT]];
    service.refreshTransform(selectedElement, [xTransform, yTransform]);
    expect(service[POINTS_FROM_PATHS][0][0].x).toBe(FINAL_X);
    expect(service[POINTS_FROM_PATHS][0][0].y).toBe(FINAL_Y);
  });
  it('refresh transform should find the path and add the new transform', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    const pathNotEqual: SVGPathElement = {} as SVGPathElement;
    const selectedElement = [pathNotEqual];
    const xTransform = 10;
    const yTransform = 10;
    const DOMPOINT = new DOMPoint(xTransform, yTransform);
    service[POINTS_FROM_PATHS] = [[DOMPOINT, path, width], [DOMPOINT, path, width]];
    service[FILLED_PATH_TO_CHECK] = [[path, DOMPOINT], [path, DOMPOINT]];
    service.refreshTransform(selectedElement, [xTransform, yTransform]);
    expect(service[POINTS_FROM_PATHS][0][0]).toBe(DOMPOINT);
  });
  it('getTranslate of path should return the translate of the path', () => {
    const path: SVGPathElement = {} as SVGPathElement;
    service[FILLED_PATH_TO_CHECK] = [[path, DOMPOINT_A]];
    const GET_TRANSLATE_OF_FILLED_PATH = 'getTranlateOfFilledPath';
    expect(service[GET_TRANSLATE_OF_FILLED_PATH](path)).toBe(DOMPOINT_A);
  });
  it('addMPoints should add the M points of d attribut', () => {
    const ADD_M_POINTS = 'addMPoints';
    const path: SVGPathElement = {} as SVGPathElement;
    const unshiftspy = spyOn(service[POINTS_FROM_PATHS], 'unshift');
    path.getAttribute = jasmine.createSpy().and.returnValue(null);
    service[ADD_M_POINTS](path, path, DOMPOINT_A);
    expect(unshiftspy).not.toHaveBeenCalled();
  });
// tslint:disable-next-line: max-file-line-count
});
