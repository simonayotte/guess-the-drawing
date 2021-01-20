import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ClipBoardService } from './clip-board.service';
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
const RENDERER = 'renderer';
const SET_ATTRIBUTE = 'setAttribute';
const TRANSLATE_PATH = 'translatePaths';
const COPY_PATH = 'copyPath';
const DELETE_CALLBACK = 'deleteSelectionCallback';
const COMMAND_INVOKER = 'commandInvoker';
const CURRENT_SELECTION = 'currentSelection';
const SELECTION_TOOL = 'selectionTool';
const CHECK_SHIFT_VALUE  = 'checkShiftValue';
const CLIPBOARD_CONTENT  = 'clipBoardContent';
const DRAWING_SIZE = 'drawingSize';
const SELECTION_MANIPULATION_SERVICE = 'selectionManipulation';
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';
describe('ClipBoardService', () => {
  let service: ClipBoardService;
  const path: SVGPathElement = {} as SVGPathElement;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ClipBoardService]});
    service = TestBed.get(ClipBoardService);
    service[RENDERER] = TestBed.get(Renderer2);
    path.getAttribute = jasmine.createSpy().and.returnValue('10');
    path.cloneNode = jasmine.createSpy().and.returnValue(path);
    service[SELECTION_TOOL].setSelectedElements = jasmine.createSpy().and.callFake(() => {return; });
    service[DELETE_CALLBACK] = jasmine.createSpy().and.callFake(() => {return; });
    service[COMMAND_INVOKER].execute = jasmine.createSpy().and.callFake(() => {return; });
    service[SELECTION_MANIPULATION_SERVICE].updateRotation = jasmine.createSpy().and.callFake(() => {return; });
  });
  it('should be created', () => {
    const serviceTest: ClipBoardService = TestBed.get(ClipBoardService);
    expect(serviceTest).toBeTruthy();
  });
  it('intializeRenderer should set the value of the renderer of the service to the one in parameter', () => {
    const mockRenderer = service[RENDERER];
    service.initializeRenderer(mockRenderer);
    expect(service[RENDERER]).toBe(mockRenderer);
  });
  it('setDeleteCallback should set the callback', () => {
    const fonction = 'fonction';
    service.setDeleteCallback(fonction);
    expect(service[DELETE_CALLBACK]).toBe(fonction);
  });
  it('checkshiftvalue should return 0 if the shiftvalue is bigger than the drawing size', () => {
    const RECTANGLE_PATH = 'M 264 146 L 264 435 L 671 435 L 671 146 Z';
    const paths = [path, path, path];
    path.getAttribute = jasmine.createSpy().and.returnValue(RECTANGLE_PATH);
    service[DRAWING_SIZE].heightBS.next(1);
    service[DRAWING_SIZE].widthBS.next(1);
    expect(service[CHECK_SHIFT_VALUE](1, paths)).toBe(0);
  });
  it('checkshiftvalue should return a shiftvalue bigger than zero if the shiftvalue is not bigger than the drawing size', () => {
    const RECTANGLE_PATH = 'M 264 146 L 264 435 L 671 435 L 671 146 Z';
    const SIZE = 500;
    const shiftValue = 20;
    const EXPECTED_SHIFT_VALUE = 40;
    const paths = [path, path, path];
    path.getAttribute = jasmine.createSpy().and.returnValue(RECTANGLE_PATH);
    service[DRAWING_SIZE].heightBS.next(SIZE);
    service[DRAWING_SIZE].widthBS.next(SIZE);
    expect(service[CHECK_SHIFT_VALUE](shiftValue, paths)).toBe(EXPECTED_SHIFT_VALUE);
  });
  it('checkshiftvalue should return a shiftvalue bigger than zero if the shiftvalue is not bigger than the drawing size', () => {
    const SIZE = 500;
    const shiftValue = 20;
    const EXPECTED_SHIFT_VALUE = 40;
    const paths = [path, path, path];
    path.getAttribute = jasmine.createSpy().and.returnValue(null);
    service[DRAWING_SIZE].heightBS.next(SIZE);
    service[DRAWING_SIZE].widthBS.next(SIZE);
    expect(service[CHECK_SHIFT_VALUE](shiftValue, paths)).toBe(EXPECTED_SHIFT_VALUE);
  });
  it('onCtrlC should put the current selection in the clipboard content', () => {
    service[CURRENT_SELECTION] = [path, path, path];
    service.onCtrlC();
    expect(service[CLIPBOARD_CONTENT]).toEqual([path, path, path]);
  });
  it('onCtrlV should execute a pasteCommande with the clipboardContent', () => {
    service[TRANSLATE_PATH] = jasmine.createSpy().and.callFake(() => {return; });
    service[CHECK_SHIFT_VALUE] = jasmine.createSpy().and.callFake(() => {return; });
    service[CLIPBOARD_CONTENT] = [path, path, path];
    service.onCtrlV();
    expect(service[COMMAND_INVOKER].execute).toHaveBeenCalled();
    expect(service[SELECTION_TOOL].setSelectedElements).toHaveBeenCalled();
  });
  it('onCtrlV should not execute a pasteCommande if theres not content in the clipboard', () => {
    service[TRANSLATE_PATH] = jasmine.createSpy().and.callFake(() => {return; });
    service[CHECK_SHIFT_VALUE] = jasmine.createSpy().and.callFake(() => {return; });
    service[CLIPBOARD_CONTENT] = [];
    service.onCtrlV();
    expect(service[COMMAND_INVOKER].execute).not.toHaveBeenCalled();
    expect(service[SELECTION_TOOL].setSelectedElements).not.toHaveBeenCalled();
  });
  it('onCtrlX should execute a cutCommand with the currentSelection content', () => {
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service[CURRENT_SELECTION] = [path, path, path];
    service.onCtrlX();
    expect(service[COMMAND_INVOKER].execute).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });
  it('onCtrlX should not execute a cutCommand if theres not currentselection', () => {
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service[CURRENT_SELECTION] = [];
    service.onCtrlX();
    expect(service[COMMAND_INVOKER].execute).not.toHaveBeenCalled();
  });
  it('onCtrlD should execute a paste command with the current selection', () => {
    service[CURRENT_SELECTION] = [path, path, path];
    service[CHECK_SHIFT_VALUE] = jasmine.createSpy().and.callFake(() => {return; });
    service.onCtrlD();
    expect(service[COMMAND_INVOKER].execute).toHaveBeenCalled();
    expect(service[SELECTION_TOOL].setSelectedElements).toHaveBeenCalled();
  });
  it('onCtrlD should not execute a paste command with the current selection if theres no current sel', () => {
    service[CURRENT_SELECTION] = [];
    service[CHECK_SHIFT_VALUE] = jasmine.createSpy().and.callFake(() => {return; });
    service.onCtrlD();
    expect(service[COMMAND_INVOKER].execute).not.toHaveBeenCalled();
    expect(service[SELECTION_TOOL].setSelectedElements).not.toHaveBeenCalled();
  });
  it('onDelete should create a CutCommand and execute it', () => {
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    service.onDelete();
    expect(service[COMMAND_INVOKER].execute).toHaveBeenCalled();
    expect(service[DELETE_CALLBACK]).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });
  it('copypath should return a copy array', () => {
    const paths = [path, path, path];
    path.cloneNode = jasmine.createSpy();
    service[COPY_PATH](paths);
    expect(path.cloneNode).toHaveBeenCalledTimes(paths.length);
  });
  it('should translate path should add an attribute translate to each path', () => {
    const array = [path, path, path];
    const translateValue = 25;
    path.getAttribute = jasmine.createSpy().and.returnValue('translate(10 10)');
    const SPY_ON_RENDERER = spyOn(service[RENDERER], SET_ATTRIBUTE);
    service[TRANSLATE_PATH](array, translateValue);
    expect(SPY_ON_RENDERER).toHaveBeenCalledTimes(array.length);
  });
  it('should translate path should add an attribute translate to each path', () => {
    const array = [path, path, path];
    const translateValue = 25;
    path.getAttribute = jasmine.createSpy().and.returnValue('');
    const SPY_ON_RENDERER = spyOn(service[RENDERER], SET_ATTRIBUTE);
    service[TRANSLATE_PATH](array, translateValue);
    expect(SPY_ON_RENDERER).toHaveBeenCalled();
  });
  it('should translate path should add an attribute translate to each path', () => {
    const array = [path, path, path];
    const translateValue = 25;
    const transform = 'translate(10 10) rotate translate';
    path.getAttribute = jasmine.createSpy().and.returnValue(transform);
    const SPY_ON_RENDERER = spyOn(service[RENDERER], SET_ATTRIBUTE);
    service[TRANSLATE_PATH](array, translateValue);
    expect(SPY_ON_RENDERER).toHaveBeenCalled();
  });
});
