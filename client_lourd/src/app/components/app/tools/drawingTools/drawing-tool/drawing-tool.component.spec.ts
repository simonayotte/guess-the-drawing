import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PathDrawingService } from 'src/app/services/tools/path-drawing/path-drawing.service';
import { PencilService } from 'src/app/services/tools/pencil-service/pencil.service';
import { CommandInvokerService } from '../../../../../services/drawing/command-invoker.service';
import { EraserService } from '../../../../../services/tools/eraser-service/eraser.service';
import { PencilComponent } from '../pencil/pencil.component';
import { DrawingToolComponent } from './drawing-tool.component';

const LESS_THAN_MIN = 0;
const MORE_THAN_MAX = 300;
const NOT_A_NUMBER = Number('a string');
const VALID_NUMBER = 100;
const DEFAULT_SIZE = 25;

const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
const ERROR_BACKGROUND = 'rgb(255, 110, 110)';

describe('DrawingToolComponent', () => {
  let component: DrawingToolComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<DrawingToolComponent>;

  const pencilTool = new PencilComponent(new PencilService(new PathDrawingService(), new CommandInvokerService(),
    new EraserService(new PathDrawingService(), new CommandInvokerService())));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.drawingTool = pencilTool;
    debugElement = fixture.debugElement;
    component.tool = pencilTool;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // onValueChange
  it('onValueChange should set size to the default one', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onValueChange(mockEvent);
    expect(component.size).toBe(DEFAULT_SIZE);
  });

  // onValueChange
  it('onValueChange should call stopPropagation, set background color to default and set size to the value entered', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onValueChange(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(pencilTool.size).toBe(+(mockEvent.target as HTMLInputElement).value);
  });

  // onInput
  it('onInput should set size to the default one', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onInput(mockEvent);
    expect(pencilTool.size).toBe(DEFAULT_SIZE);
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
  });

  // onInput
  it('onInput should call stopPropagation, set background color to default and set size to the value entered', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onInput(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(pencilTool.size).toBe(+(mockEvent.target as HTMLInputElement).value);
  });

  // isValidSize
  it('isValidSize should verify if the size is in a range and if its a number', () => {

    let returnedValue = component.isValidSize(LESS_THAN_MIN);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSize(MORE_THAN_MAX);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSize(NOT_A_NUMBER);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSize(VALID_NUMBER);
    expect(returnedValue).toBe(true);
  });

  // onSliderChannge
  it('onSliderChannge should change the size of component and of the drawingTool with the event', () => {
    const mockSliderChange = new MatSliderChange();
    mockSliderChange.value = null;

    pencilTool.size = 0;
    component.size = 0;
    component.onSliderChange(mockSliderChange);
    expect(component.size).toBe(0);
    expect(pencilTool.size).toBe(0);

    mockSliderChange.value = 1;
    component.onSliderChange(mockSliderChange);
    expect(component.size).toBe(mockSliderChange.value);
    expect(pencilTool.size).toBe(mockSliderChange.value);
  });
});
