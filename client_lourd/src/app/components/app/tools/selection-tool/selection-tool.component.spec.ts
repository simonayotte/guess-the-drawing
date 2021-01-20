import { Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '../color-picker/color';
import { SelectionToolComponent } from './selection-tool.component';

const SELECTION_SERVICE = 'selectionService';
const SELECTION_ROTATION_SERVICE = 'selectionRotationService';
const CLIPBOARD_SERVICE = 'clipBoardService';
describe('SelectionToolComponent', () => {
  let component: SelectionToolComponent;
  let fixture: ComponentFixture<SelectionToolComponent>;
  let renderer: Renderer2;
  const mockMouseEvent: MouseEvent = new MouseEvent('click');
  const mockKeyboardEvent: KeyboardEvent = new KeyboardEvent('arrowsClick');
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionToolComponent);
    component = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('function related to clipboard should be redirected to the clipboard service', () => {
    component[CLIPBOARD_SERVICE].onCtrlC = jasmine.createSpy().and.callFake(() => {return; });
    component.onCtrlC();
    expect(component[CLIPBOARD_SERVICE].onCtrlC).toHaveBeenCalled();
  });
  it('function related to clipboard should be redirected to the clipboard service', () => {
    component[CLIPBOARD_SERVICE].onCtrlV = jasmine.createSpy().and.callFake(() => {return; });
    component.onCtrlV();
    expect(component[CLIPBOARD_SERVICE].onCtrlV).toHaveBeenCalled();
  });
  it('function related to clipboard should be redirected to the clipboard service', () => {
    component[CLIPBOARD_SERVICE].onCtrlD = jasmine.createSpy().and.callFake(() => {return; });
    component.onCtrlD();
    expect(component[CLIPBOARD_SERVICE].onCtrlD).toHaveBeenCalled();
  });
  it('function related to clipboard should be redirected to the clipboard service', () => {
    component[CLIPBOARD_SERVICE].onCtrlX = jasmine.createSpy().and.callFake(() => {return; });
    component.onCtrlX();
    expect(component[CLIPBOARD_SERVICE].onCtrlX).toHaveBeenCalled();
  });
  it('function related to clipboard should be redirected to the clipboard service', () => {
    component[CLIPBOARD_SERVICE].onDelete = jasmine.createSpy().and.callFake(() => {return; });
    component.onDelete();
    expect(component[CLIPBOARD_SERVICE].onDelete).toHaveBeenCalled();
  });
  it('onMouseWheel should call onMouseWheel of selectionRotationSerivceService', () => {
    spyOn(component[SELECTION_ROTATION_SERVICE], 'onMouseWheelMovement');
    component.onMouseWheel(new WheelEvent('wheelEvent'));
    expect(component[SELECTION_ROTATION_SERVICE].onMouseWheelMovement).toHaveBeenCalled();
  });

  it('onAltDown should call onAltDown of selectionRotationService', () => {
    spyOn(component[SELECTION_ROTATION_SERVICE], 'onAltDown');
    component.onAltDown();
    expect(component[SELECTION_ROTATION_SERVICE].onAltDown).toHaveBeenCalled();
  });

  it('onAltUp should call onAltUp of selectionRotationService', () => {
    spyOn(component[SELECTION_ROTATION_SERVICE], 'onAltUp');
    component.onAltUp();
    expect(component[SELECTION_ROTATION_SERVICE].onAltUp).toHaveBeenCalled();
  });

  it('onShiftDown should call onShiftDown of selectionRotationService', () => {
    spyOn(component[SELECTION_ROTATION_SERVICE], 'onShiftDown');
    component.onShiftDown();
    expect(component[SELECTION_ROTATION_SERVICE].onShiftDown).toHaveBeenCalled();
  });

  it('onShiftUp should call onShiftUp of selectionRotationService', () => {
    spyOn(component[SELECTION_ROTATION_SERVICE], 'onShiftUp');
    component.onShiftUp();
    expect(component[SELECTION_ROTATION_SERVICE].onShiftUp).toHaveBeenCalled();
  });

  it('initializeRender should call initialize renderer of selecitonToolService', () => {
    spyOn(component[SELECTION_SERVICE], 'initializeRenderer');
    component.initializeRenderer(renderer);
    expect(component[SELECTION_SERVICE].initializeRenderer).toHaveBeenCalled();
  });

  it('onRightClickDown should call onRightClickDown of selectionToolService', () => {
    spyOn(component[SELECTION_SERVICE], 'onRightClickDown');
    component.onRightClickDown(mockMouseEvent);
    expect(component[SELECTION_SERVICE].onRightClickDown).toHaveBeenCalled();
  });

  it('onMouseDownInElement should call onMouseDownInElement of selectionToolService', () => {
    spyOn(component[SELECTION_SERVICE], 'onMouseDownInElement');
    component.onMouseDownInElement(mockMouseEvent, new Color(0, 0, 0, 0));
    expect(component[SELECTION_SERVICE].onMouseDownInElement).toHaveBeenCalled();
  });

  it('onMouseUp should call onMouseUp of selectionToolService', () => {
    spyOn(component[SELECTION_SERVICE], 'onMouseUp');
    component.onMouseUp(mockMouseEvent);
    expect(component[SELECTION_SERVICE].onMouseUp).toHaveBeenCalled();
  });

  it('onMouseMove should call onMouseMove of selectionToolService', () => {
    spyOn(component[SELECTION_SERVICE], 'onMouseMove');
    component.onMouseMove(mockMouseEvent);
    expect(component[SELECTION_SERVICE].onMouseMove).toHaveBeenCalled();
  });

  it('onMouseEnter should call onMouseEnter of selectionToolService', () => {
    spyOn(component[SELECTION_SERVICE], 'onMouseEnter');
    component.onMouseEnter(mockMouseEvent);
    expect(component[SELECTION_SERVICE].onMouseEnter).toHaveBeenCalled();
  });

  it('onMouseLeave should call onMouseLeave of selectionToolService', () => {
    spyOn(component[SELECTION_SERVICE], 'onMouseLeave');
    component.onMouseLeave(mockMouseEvent);
    expect(component[SELECTION_SERVICE].onMouseLeave).toHaveBeenCalled();
  });

  it('selectAll should call selectAllElements of selectionToolService', () => {
    spyOn(component[SELECTION_SERVICE], 'selectAllElements');
    component.selectAll();
    expect(component[SELECTION_SERVICE].selectAllElements).toHaveBeenCalled();
  });

  it('onArrowsChanges should call onArrowsChange of selectionToolService', () => {
    spyOn(component[SELECTION_SERVICE], 'onArrowsChange');
    component.onArrowsChange(new Map(), mockKeyboardEvent);
    expect(component[SELECTION_SERVICE].onArrowsChange).toHaveBeenCalled();
  });

  it('clearSelection should call clear selection of selectionTollService', () => {
    spyOn(component[SELECTION_SERVICE], 'clearSelection');
    component.clearSelection();
    expect(component[SELECTION_SERVICE].clearSelection).toHaveBeenCalled();
  });

});
