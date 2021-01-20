import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogNewDrawingComponent } from './dialog-new-drawing.component';

const ERROR_BACKGROUND = 'rgb(255, 110, 110)';
const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';

describe('DialogNewDrawingComponent', () => {
  let component: DialogNewDrawingComponent;
  let fixture: ComponentFixture<DialogNewDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('buttonIsDisplayed should set colorIsConfirmed', () => {
    component.colorIsConfirmed = false;
    component.buttonIsDisplayed(true);
    expect(component.colorIsConfirmed).toBe(true);

  });

  it('drawingCanBeCreated should returned if the button can be showned if all informations are correct', () => {
    component.colorIsConfirmed = true;
    spyOn(component, 'isSizeValid').and.returnValue(true);
    const returnedValue = component.drawingCanBeCreated();
    expect(returnedValue).toBe(true);

  });

  it('drawingCanBeCreated should returned if the button can be showned if all informations are correct', () => {
    component.colorIsConfirmed = false;
    spyOn(component, 'isSizeValid').and.returnValue(true);
    const returnedValue = component.drawingCanBeCreated();
    expect(returnedValue).toBe(false);

  });

  // onInputChangeWidth()
  it('onInputChangeHeight should call updateWidth and return a value to widthIsValid', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    component.widthIsValid = true;

    spyOn(component.widthInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'drawingCanBeCreated');
    spyOn(component.drawingSizeService, 'updateWidth').and.returnValue(false);

    component.onInputChangeWidth( 1, mockEvent);
    expect(component.drawingCanBeCreated).toHaveBeenCalled();
    expect(component.widthInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);

  });

  // onInputChangeWidth()
  it('onInputChangeWidth should call updateWidth and return a value to widthIsValid', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    component.widthIsValid = false;

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.drawingSizeService, 'updateWidth').and.returnValue(true);

    component.onInputChangeWidth( 1, mockEvent);
    expect(component.widthInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.widthIsValid).toBe(true);
  });

  // onInputChangeHeight()
  it('onInputChangeHeight should call updateHeight and return a value to heightIsValid', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    component.heightIsValid = true;

    spyOn(component.heightInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'drawingCanBeCreated');
    spyOn(component.drawingSizeService, 'updateHeight').and.returnValue(false);

    component.onInputChangeHeight( 1, mockEvent);
    expect(component.drawingCanBeCreated).toHaveBeenCalled();
    expect(component.heightInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);

  });

  // onInputChangeHeight()
  it('onInputChangeHeight should call updateHeight and return a value to heightIsValid', () => {
    const mockEvent = new KeyboardEvent('mockEvent');
    component.heightIsValid = false;

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.drawingSizeService, 'updateHeight').and.returnValue(true);

    component.onInputChangeHeight( 1, mockEvent);
    expect(component.heightInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.heightIsValid).toBe(true);
  });

  // isSizeValid()
  it('isSizeValid should toggle btn disabled to false if widthIsValid and heigtIsValid', () => {
    component.widthIsValid = true;
    component.heightIsValid = true;
    const returnedValue = component.isSizeValid();
    expect(returnedValue).toBe(true);
  });

  // createNewDrawing()
  it('createNewDrawing should newDrawing and closeAll', () => {
    spyOn(component.dialog, 'closeAll');
    spyOn(component.drawingSizeService, 'newDrawing');
    component.createNewDrawing();
    expect(component.dialog.closeAll).toHaveBeenCalled();
    expect(component.drawingSizeService.newDrawing).toHaveBeenCalled();
  });

  // closeDialog()
  it('closeDialog should call closeAll from dialog', () => {
    spyOn(component.dialog, 'closeAll');
    component.closeDialog();
    expect(component.dialog.closeAll).toHaveBeenCalled();
  });

});
