
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SaveDrawingComponent } from './save-drawing.component';

const SAVE_DRAWING_SERVICE = 'saveDrawingService';
const ERROR_BACKGROUND = 'rgb(255, 110, 110)';
const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
const TAG = 'tag';
const NAME = 'name';
const TAGS = 'tags';
const NAME_IS_VALID = 'nameIsValid';
const TAG_IS_VALID = 'tagIsValid';

describe('SaveDrawingComponent', () => {
  let component: SaveDrawingComponent;
  let fixture: ComponentFixture<SaveDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, AppRoutingModule, AppModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // onInputChangeName()
  it('onInputChangeName should call tagIsValid, stopImediatePropagation, ERROR_BACKGROUND is set  if tagIsValid false', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'nameIsValid').and.returnValue(false);

    spyOn(component.tagInput.nativeElement.style, 'backgroundColor');

    component.onInputChangeName( 'bad-name', mockEvent);
    expect(component.nameInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
    expect(component[NAME]).toBe('');
  });

  // onInputChangeName()
  it('onInputChangeName should call tagIsValid, stopImediatePropagation, DEFAULT_BACKGROUND is set  if tagIsValid', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'nameIsValid').and.returnValue(true);

    spyOn(mockEvent, 'stopImmediatePropagation');

    component.onInputChangeName( 'goodName', mockEvent);
    expect(component.nameInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component[NAME]).toBe('goodName');
  });

  // onInputChangeTag()
  it('onInputChangeTag should call tagIsValid, stopImediatePropagation, ERROR_BACKGROUND is set  if tagIsValid false', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(false);
    component[TAGS] = [TAG, TAG, TAG, TAG, TAG, TAG];

    spyOn(component.tagInput.nativeElement.style, 'backgroundColor');

    component.onInputChangeTag( 'bad-tag', mockEvent);
    expect(component.tagInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
    expect(component[TAG]).toBe('');
    expect(component.btnAdd.disabled).toBe(true);
  });

  // onInputChangeTag()
  it('onInputChangeTag should call tagIsValid, stopImediatePropagation, DEFAULT_BACKGROUND is set  if tagIsValid', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(true);
    spyOn(mockEvent, 'stopImmediatePropagation');

    component.onInputChangeTag( 'goodTag', mockEvent);
    expect(component.tagInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component[TAG]).toBe('goodTag');
  });

  // btnSaveDrawing()
  it('btnSaveDrawing should toggle btn disabled to false if nameIsValid', () => {
    component.btnSave.disabled = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'nameIsValid').and.returnValue(true);
    const returnedValue = component.btnSaveDrawing();
    expect(component.btnSave.disabled).toBe(false);
    expect(returnedValue).toBe(false);
  });

  // btnAddTag()
  it('btnAddTag should toggle btn disabled to false if tagIsValid', () => {
    component.btnSave.disabled = true;
    component[TAGS] = [TAG, TAG];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(true);
    const returnedValue = component.btnAddTag();
    expect(component.btnAdd.disabled).toBe(false);
    expect(returnedValue).toBe(false);
  });

  // saveDrawing()
  it('saveDrawing should call saveDrawing and closeAll', () => {
    spyOn(component.dialog, 'closeAll');
    spyOn(component[SAVE_DRAWING_SERVICE], 'saveDrawing');
    component.saveDrawing();
    expect(component.dialog.closeAll).toHaveBeenCalled();
    expect(component[SAVE_DRAWING_SERVICE].saveDrawing).toHaveBeenCalled();
  });

  // saveDrawing()
  it('saveDrawing should call confirmationSave.open if there is an error', () => {
    spyOn(component.dialog, 'closeAll');
    spyOn(component[SAVE_DRAWING_SERVICE], 'saveDrawing').and.throwError('drawingNotSaved');
    try {
      component.saveDrawing();
    } catch (error) {
      const CONFIRMATION_BAR = 'confirmationBar';
      expect(component[CONFIRMATION_BAR].open).toHaveBeenCalled();
    }
    expect(component.dialog.closeAll).toHaveBeenCalled();
  });

  // closeDialog()
  it('closeDialog should call closeAll from dialog', () => {
    spyOn(component.dialog, 'closeAll');
    component.closeDialog();
    expect(component.dialog.closeAll).toHaveBeenCalled();
  });

  // resetValue()
  it('resetValue() should put the native value of tag at nothing', () => {
    component.tagInput.nativeElement.value = 'tag';
    component.resetValue();
    expect(component.tagInput.nativeElement.value).toBe('');
  });

  // removeTag()
  it('removeTag() should delete tag from tags', () => {
    component[TAGS] = [TAG];
    component.removeTag(TAG);
    expect(component[TAGS]).toEqual([]);
  });

  // addTag()
  it('addTag() should add tag in tags', () => {
    component[TAGS] = [];
    component[TAG] = TAG;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(true);
    component.addTag();
    expect(component[TAGS]).toEqual([TAG]);
  });

   // addTag()
  it('addTag() should not add tag in tags if tag not valid', () => {
    component[TAGS] = [];
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'tagIsValid').and.returnValue(false);
    component.addTag();
    expect(component[TAGS]).toEqual([]);
  });

  // tagIsValid()
  it('tagIsValid() should call tagIsValid', () => {
    spyOn(component[SAVE_DRAWING_SERVICE], 'nameIsValid');
    component[TAG_IS_VALID](TAG);
    expect(component[SAVE_DRAWING_SERVICE].nameIsValid).toHaveBeenCalled();
  });

  // nameIsValid()
  it('nameIsValid() should call nameIsValid', () => {
    spyOn(component[SAVE_DRAWING_SERVICE], 'nameIsValid');
    component[NAME_IS_VALID](NAME);
    expect(component[SAVE_DRAWING_SERVICE].nameIsValid).toHaveBeenCalled();
  });
});
