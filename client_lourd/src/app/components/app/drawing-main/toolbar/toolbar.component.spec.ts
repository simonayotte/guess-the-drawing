import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { Color } from '../../tools/color-picker/color';
import { SelectionToolComponent } from '../../tools/selection-tool/selection-tool.component';
import { ToolButton } from '../../tools/tool-button';
import { ToolbarComponent } from './toolbar.component';

const DIALOG_SERVICE = 'dialogService';
const GRID_SERVICE = 'gridService';
const SELECTED_BUTTON = 'selectedButton';
const CLEAR_SELECTION_RECTANGLE = 'clearSelectionRectangle';
const SELECT_BUTTON = 'selectButton';
const SELECTION = 8;

describe('a toolbar component', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let debugElement: DebugElement;
  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, AppRoutingModule, AppModule],
      providers: [ ChangeDetectorRef ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should have an instance', () => {
    expect(component).toBeDefined();
  });

  // onSelect
  it('onSelect should call attribute the button to selectedButton and toggle toolSelected', () => {
    const mockToolButton1 = new ToolButton();
    component.selectedButton = mockToolButton1;
    component.toolSelected = true;

    component.onSelect(mockToolButton1);
    expect(component.toolSelected).toBe(false);

    const mockToolButton2 = new ToolButton();
    component.selectedButton = mockToolButton1;
    component.toolSelected = true;

    component.onSelect(mockToolButton2);
    expect(component.toolSelected).toBe(true);
    expect(component.selectedButton).toBe(mockToolButton2);

    component.selectedButton = mockToolButton1;
    component.toolSelected = false;

    component.onSelect(mockToolButton2);
    expect(component.toolSelected).toBe(true);
    expect(component.selectedButton).toBe(mockToolButton2);

  });

  it('onCtrlS should prevent default and call openSaveDrawingDialog', () => {
    const mockCtrlS = new KeyboardEvent('ctrlS');
    spyOn(component, 'openSaveDrawingDialog');
    spyOn(mockCtrlS, 'preventDefault');
    component.onCtrlS(mockCtrlS);
    expect(component.openSaveDrawingDialog).toHaveBeenCalled();
    expect(mockCtrlS.preventDefault).toHaveBeenCalled();
  });

  it('onCtrle should prevent default and call openExportDialog', () => {
    const mockCtrlE = new KeyboardEvent('ctrlE');
    spyOn(component, 'openExportDialog');
    spyOn(mockCtrlE, 'preventDefault');
    component.onCtrlE(mockCtrlE);
    expect(component.openExportDialog).toHaveBeenCalled();
    expect(mockCtrlE.preventDefault).toHaveBeenCalled();
  });

  it('onSelectShould set toolSelected to true if the clicked button is selected one and ', () => {
    const mockToolButton = new ToolButton();
    component.toolSelected = false;
    component[SELECTED_BUTTON] = mockToolButton;
    component.onSelect(mockToolButton);
    expect(component.toolSelected).toBe(true);
  });

  it('clearSelectionRectangle should call clearSelection if the the selected tool is the selection tool', () => {
    component.selectedButton = component.buttons[SELECTION];
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component.selectedButton.tool, 'clearSelection');
    component[CLEAR_SELECTION_RECTANGLE]();
    expect((component.selectedButton.tool as SelectionToolComponent).clearSelection).toHaveBeenCalled();
  });

  it('openSaveDrawingDialog should call openSaveDrawingDialog of dialogService', () => {
    spyOn(component[DIALOG_SERVICE], 'openSaveDrawingDialog');
    component.openSaveDrawingDialog();
    expect(component[DIALOG_SERVICE].openSaveDrawingDialog).toHaveBeenCalled();
  });

  // openColorPicker
  it('openColorPicker should call onSelect', () => {
    const PRIMARY_COLOR = 0;
    spyOn(component[DIALOG_SERVICE], 'openColorPicker');

    component.openColorPicker(PRIMARY_COLOR);

    expect(component[DIALOG_SERVICE].openColorPicker).toHaveBeenCalledTimes(1);

  });

  it('onG should call next on gridActivationSubject if there is no openDialog', () => {
    spyOn(component[DIALOG_SERVICE], 'hasOpenDialog').and.returnValue(false);
    const spyNext = spyOn(component[GRID_SERVICE].gridActivationSubject, 'next');

    const mockEvent = new KeyboardEvent('g');
    component.onG(mockEvent);

    expect(spyNext).toHaveBeenCalled();
  });

  it('onG should not call next on gridActivationSubject if there is an openDialog', () => {
    spyOn(component[DIALOG_SERVICE], 'hasOpenDialog').and.returnValue(true);
    const spyNext = spyOn(component[GRID_SERVICE].gridActivationSubject, 'next');

    const mockEvent = new KeyboardEvent('g');
    component.onG(mockEvent);

    expect(spyNext).toHaveBeenCalledTimes(0);
  });

  it('getSelectedButton should return the selectedButton', () => {
    const mockToolButton = new ToolButton();
    component[SELECTED_BUTTON] = mockToolButton;
    const selectedButton = component.getSelectedButton();
    expect(selectedButton).toEqual(mockToolButton);
  });

  // rectangleToolShortcut
  it('rectangleToolShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.rectangleToolShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  it('selectButton should call onSelect if there is no openDialog', () => {
    spyOn(component[DIALOG_SERVICE], 'hasOpenDialog').and.returnValue(false);
    spyOn(component, 'onSelect');
    component[SELECT_BUTTON](0);
    expect(component.onSelect).toHaveBeenCalled();
  });

  it('selectButton should throw an error if there is an openDialog', () => {
    spyOn(component[DIALOG_SERVICE], 'hasOpenDialog').and.returnValue(true);
    expect( () => {
      component[SELECT_BUTTON](0);
    }).toThrowError();
  });

  it('aerosolToolShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.aerosolToolShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  it('color-applicator should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.colorApplicatorShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  it('selectionToolShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.selectionToolShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  it('pipetteShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.pipetteShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  it('eraserShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.eraserShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  it('ellipseShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.ellipseShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  it('polygoneShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.polygoneShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  it('paintBucketShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.paintBucketShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  it('onKeyDown should call selectionTool.onAltDown if the key pressed is alt', () => {
    const mockAlt = jasmine.createSpyObj('Alt', ['key', 'preventDefault']);
    mockAlt.key = 'Alt';
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component.buttons[SELECTION].tool, 'onAltDown');
    component.onKeyDown(mockAlt);
    expect(component.buttons[SELECTION].tool.onAltDown).toHaveBeenCalled();
  });

  it('onKeyDown should call selectionTool.onShiftDown if the key pressed is shift', () => {
    const mockShift = jasmine.createSpyObj('Shift', ['key', 'preventDefault']);
    mockShift.key = 'Shift';
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component.buttons[SELECTION].tool, 'onShiftDown');
    component.onKeyDown(mockShift);
    expect(component.buttons[SELECTION].tool.onShiftDown).toHaveBeenCalled();
  });

  it('onKeyUp should call selectionTool.onAltUp if the key pressed is alt', () => {
    const mockAlt = jasmine.createSpyObj('Alt', ['key', 'preventDefault']);
    mockAlt.key = 'Alt';
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component.buttons[SELECTION].tool, 'onAltUp');
    component.onKeyUp(mockAlt);
    expect(component.buttons[SELECTION].tool.onAltUp).toHaveBeenCalled();
  });

  it('onKeyUp should call selectionTool.onShiftUp if the key pressed is shift', () => {
    const mockShift = jasmine.createSpyObj('Shift', ['key', 'preventDefault']);
    mockShift.key = 'Shift';
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component.buttons[SELECTION].tool, 'onShiftUp');
    component.onKeyUp(mockShift);
    expect(component.buttons[SELECTION].tool.onShiftUp).toHaveBeenCalled();
  });

  it('onKeyUp should call not selectionTool.onShiftUp/onAltUp if the key pressed is neither shift or alt', () => {
    const mockKey = jasmine.createSpyObj('Shift', ['key', 'preventDefault']);
    mockKey.key = 'Space';
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component.buttons[SELECTION].tool, 'onShiftUp');
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component.buttons[SELECTION].tool, 'onAltUp');
    component.onKeyUp(mockKey);
    expect(component.buttons[SELECTION].tool.onShiftUp).toHaveBeenCalledTimes(0);
    expect(component.buttons[SELECTION].tool.onAltUp).toHaveBeenCalledTimes(0);
  });

  it('onKeyDown should call not selectionTool.onShiftDown/onAltDown if the key pressed is neither shift or alt', () => {
    const mockKey = jasmine.createSpyObj('Shift', ['key', 'preventDefault']);
    mockKey.key = 'Space';
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component.buttons[SELECTION].tool, 'onShiftDown');
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component.buttons[SELECTION].tool, 'onAltDown');
    component.onKeyDown(mockKey);
    expect(component.buttons[SELECTION].tool.onShiftDown).toHaveBeenCalledTimes(0);
    expect(component.buttons[SELECTION].tool.onAltDown).toHaveBeenCalledTimes(0);
  });

  // brushToolShortcut
  it('brushToolShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.brushToolShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  // pencilToolShortcut
  it('pencilToolShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.pencilToolShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  // lineToolShortcut
  it('lineToolShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.lineToolShortcut();
    expect(component[SELECT_BUTTON]).toHaveBeenCalled();
  });

  // openUserGuideDialog
  it('openUserGuideDialog should call openUserGuideDialog', () => {
    spyOn(component[DIALOG_SERVICE], 'openUserGuideDialog');

    component.openUserGuideDialog();
    expect(component[DIALOG_SERVICE].openUserGuideDialog).toHaveBeenCalled();
  });

  it('openNewDrawingDialog should call openNewDrawingDialogs of dialogService', () => {
    spyOn(component[DIALOG_SERVICE], 'openNewDrawingDialogs');

    component.openNewDrawingDialog();
    expect(component[DIALOG_SERVICE].openNewDrawingDialogs).toHaveBeenCalled();
  });

  // openExportDialog
  it('openExportDialog should call openExportDialog', () => {
    spyOn(component[DIALOG_SERVICE], 'openExportDialog');

    component.openExportDialog();
    expect(component[DIALOG_SERVICE].openExportDialog).toHaveBeenCalled();
  });

  // changeBackgroundColor
  it('changeBackgroundColor should call openColorPicker and changeBooleanForBackground', () => {
    spyOn(component[DIALOG_SERVICE], 'openColorPicker');

    component.changeBackgroundColor();

    expect(component[DIALOG_SERVICE].openColorPicker).toHaveBeenCalled();
  });

  // switchPrimaryAndSecondary
  it('switchPrimaryAndSecondary should call switch primary and secondary colors together', () => {
    const mockColor1 = new Color(0, 0, 0, 0);
    const mockColor2 = new Color(1, 1, 1, 1);
    component.primaryColor = mockColor1;
    component.secondaryColor = mockColor2;

    component.switchPrimaryAndSecondary();
    expect(component.primaryColor).toEqual(mockColor2);
    expect(component.secondaryColor).toEqual(mockColor1);
  });

  it('Change primary alpha should change the alpha of the primary color', () => {
    const testValue = 0.75;

    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);
    (mockEvent.target as HTMLInputElement).valueAsNumber = testValue;
    const spyOnFunction = spyOn(component.primaryColor, 'setA');
    component.changePrimaryAlpha(mockEvent);
    expect(spyOnFunction).toHaveBeenCalledWith(testValue);
  });

  it('Change primary alpha should change the alpha of the primary color', () => {
    const testValue = 0.75;

    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);
    (mockEvent.target as HTMLInputElement).valueAsNumber = testValue;
    const spyOnFunction = spyOn(component.secondaryColor, 'setA');
    component.changeSecondaryAlpha(mockEvent);
    expect(spyOnFunction).toHaveBeenCalledWith(testValue);
  });

  it('undo and redo should call respectively undo and redo from commandInvoker', () => {
    const COMMAND_INVOKER_SERVICE = 'commandInvoker';
    const spyOnUndo = spyOn(component[COMMAND_INVOKER_SERVICE], 'undo');
    const spyOnRedo = spyOn(component[COMMAND_INVOKER_SERVICE], 'redo');
    component.undo();
    component.redo();
    expect(spyOnUndo).toHaveBeenCalled();
    expect(spyOnRedo).toHaveBeenCalled();
  });
// We disabled this rule since this is a test file and the number of lines isnt important
// tslint:disable-next-line: max-file-line-count
});
