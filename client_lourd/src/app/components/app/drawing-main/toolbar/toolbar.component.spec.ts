import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ToolButton } from '../../tools/tool-button';
import { ToolbarComponent } from './toolbar.component';

const DIALOG_SERVICE = 'dialogService';
const GRID_SERVICE = 'gridService';
const SELECTED_BUTTON = 'selectedButton';
const SELECT_BUTTON = 'selectButton';

describe('a toolbar component', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
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
    fixture.detectChanges();
  });

  it('should have an instance', () => {
    expect(component).toBeDefined();
  });

  // onSelect
  it('onSelect should call attribute the button to selectedButton and toggle toolSelected', () => {
    const mockToolButton1 = new ToolButton();
    component.selectedButton = mockToolButton1;

    component.onSelect(mockToolButton1);
    expect(component.selectedButton).toBe(mockToolButton1);

    const mockToolButton2 = new ToolButton();
    component.selectedButton = mockToolButton1;

    component.onSelect(mockToolButton2);
    expect(component.selectedButton).toBe(mockToolButton2);

    component.selectedButton = mockToolButton1;

    component.onSelect(mockToolButton2);
    expect(component.selectedButton).toBe(mockToolButton2);

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

  it('eraserShortcut should call onSelect', () => {
    // We disable this any so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'selectButton');
    component.eraserShortcut();
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
