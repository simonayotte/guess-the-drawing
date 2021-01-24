import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material';
import { By } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SelectedColorsService } from 'src/app/services/color-picker/selected-colors.service';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { DrawingSizeService } from 'src/app/services/drawing/drawing-size.service';
import { GallerieDrawingService } from 'src/app/services/gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from 'src/app/services/svg-service/svg.service';
import { PathDrawingService } from 'src/app/services/tools/path-drawing/path-drawing.service';
import { CommandInvokerService } from '../../../../../services/drawing/command-invoker.service';
import { EraserService } from '../../../../../services/tools/eraser-service/eraser.service';
import { RectangleToolComponent } from '../rectangle-tool/rectangle-tool.component';
import { ShapeToolComponent } from './shape-tool.component';

const SHAPE_TYPE = 'a shape path';
const LESS_THAN_MIN = 0;
const MORE_THAN_MAX = 300;
const NOT_A_NUMBER = Number('a string');
const VALID_NUMBER = 25;
const DEFAULT_SIZE = 5;

const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
const ERROR_BACKGROUND = 'rgb(255, 110, 110)';

describe('ShapeToolComponent', () => {
  let component: ShapeToolComponent;
  let fixture: ComponentFixture<ShapeToolComponent>;
  let debugElement: DebugElement;
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const rectangleTool = new RectangleToolComponent(
    new RectangleService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing),
      new EraserService(
        new PathDrawingService(), new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.shapeTool = rectangleTool;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //  onLineSizeChange()
  it('onLineSizeChange should affect event.value to lineSize', () => {
    const mockMatSliderChange: MatSliderChange = new MatSliderChange();
    component.shapeTool.lineSize = 0;
    mockMatSliderChange.value = 1;
    component.onLineSizeChange(mockMatSliderChange);
    expect(rectangleTool.lineSize).toBe(mockMatSliderChange.value);
  });

  //  onLineSizeChange()
  it('onLineSizeChange should not affect anything if event.value is null', () => {
    const mockMatSliderChange: MatSliderChange = new MatSliderChange();
    component.lineSize = 0;
    component.shapeTool.lineSize = 0;
    mockMatSliderChange.value = null;
    component.onLineSizeChange(mockMatSliderChange);
    expect(component.lineSize).toBe(0);
    expect(component.shapeTool.lineSize).toBe(0);
  });

  //  onTypeChange()
  it('onInputChange should affect event.value to lineSize', () => {
    const mockEvent = jasmine.createSpyObj('radioButton', ['value']);
    component.shapeTool.shapeType = SHAPE_TYPE;
    component.onTypeChange(mockEvent);
    expect(rectangleTool.shapeType).toBe(mockEvent.value);
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

  // onValueChange
  it('onValueChange should set size to the default one', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onValueChange(mockEvent);
    expect(component.lineSize).toBe(DEFAULT_SIZE);
  });

  // onValueChange
  it('onValueChange should call stopPropagation, set background color to default and set size to the value entered', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);
    const mockTarget = jasmine.createSpyObj('target', ['value']);
    mockTarget.value = '25';
    spyOnProperty(mockEvent, 'target').and.returnValue(mockTarget);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onValueChange(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(rectangleTool.lineSize).toBe(+(mockEvent.target as HTMLInputElement).value);
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
    expect(rectangleTool.lineSize).toBe(DEFAULT_SIZE);
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
  });

  // onInput
  it('onInput should call stopPropagation, set background color to default and set size to the value entered', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);
    const mockTarget = jasmine.createSpyObj('target', ['value']);
    mockTarget.value = '25';
    spyOnProperty(mockEvent, 'target').and.returnValue(mockTarget);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onInput(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(rectangleTool.lineSize).toBe(+(mockEvent.target as HTMLInputElement).value);
  });

});
