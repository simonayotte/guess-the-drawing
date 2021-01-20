import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement, Renderer2, Type } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { By } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SelectedColorsService } from 'src/app/services/color-picker/selected-colors.service';
import { SvgService } from 'src/app/services/svg-service/svg.service';
import { PaintBucketService } from 'src/app/services/tools/paint-bucket/paint-bucket.service';
import { PathDrawingService } from 'src/app/services/tools/path-drawing/path-drawing.service';
import { ContinueDrawingService } from '../../../../services/continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../../../services/drawing/command-invoker.service';
import { DrawingSizeService } from '../../../../services/drawing/drawing-size.service';
import { GallerieDrawingService } from '../../../../services/gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { PaintBucketComponent } from './paint-bucket.component';
const paintBucketService = 'paintBucketService';

const LESS_THAN_MIN = -1;
const MORE_THAN_MAX = 300;
const NOT_A_NUMBER = Number('a string');
const VALID_NUMBER = 50;
const MAX_TOLERANCE = 100;
const MIN_TOLERANCE = 0;
const DEFAULT_TOLERANCE = 10;
const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
const ERROR_BACKGROUND = 'rgb(255, 110, 110)';

describe('PaintBucketComponent', () => {
  let renderer: Renderer2;
  let debugElement: DebugElement;
  let component: PaintBucketComponent;
  let fixture: ComponentFixture<PaintBucketComponent>;

  const paintBucketTool = new PaintBucketComponent(new PaintBucketService(new PathDrawingService(),
                          new SvgService(), new SelectedColorsService(),
                          new CommandInvokerService(new ContinueDrawingService
                          (new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService()))));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBucketComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component.tool = paintBucketTool;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer()', () => {
    spyOn(component[paintBucketService], 'initializeRenderer');

    component.initializeRenderer(renderer);
    expect(component[paintBucketService].initializeRenderer).toHaveBeenCalled();

  });

  // onMouseDownInElement
  it('onMouseDownInElement should call onMouseDownInElement', () => {
    const mockMouseDown = new MouseEvent('onMouseDownInElement');

    spyOn(component[paintBucketService], 'onMouseDownInElement');

    component.onMouseDownInElement(mockMouseDown);

    expect(component[paintBucketService].onMouseDownInElement).toHaveBeenCalled();
  });

  // onValueChange
  it('onValueChange should set size to the default one', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onValueChange(mockEvent);
    expect(component.tolerance).toBe(DEFAULT_TOLERANCE);
  });

  // onValueChange
  it('onValueChange should call stopPropagation, set background color to default and set size to the value entered', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.toleranceInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onValueChange(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.toleranceInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(paintBucketTool.tolerance).toBe(+(mockEvent.target as HTMLInputElement).value);
  });

  // onInput
  it('onInput should set size to the default one', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.toleranceInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onInput(mockEvent);
    expect(paintBucketTool.tolerance).toBe(DEFAULT_TOLERANCE);
    expect(component.toleranceInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
  });

  // onInput
  it('onInput should call stopPropagation, set background color to default and set size to the value entered', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.toleranceInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onInput(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.toleranceInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(paintBucketTool.tolerance).toBe(+(mockEvent.target as HTMLInputElement).value);
  });

  // isValidSize
  it('isValidSize should verify if the size is in a range and if its a number', () => {

    let returnedValue = component.isValidSize(LESS_THAN_MIN, MAX_TOLERANCE, MIN_TOLERANCE);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSize(MORE_THAN_MAX, MAX_TOLERANCE, MIN_TOLERANCE);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSize(NOT_A_NUMBER, MAX_TOLERANCE, MIN_TOLERANCE);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSize(VALID_NUMBER, MAX_TOLERANCE, MIN_TOLERANCE);
    expect(returnedValue).toBe(true);
  });

  // onSliderChannge
  it('onSliderChannge should change the size of component and of the drawingTool with the event', () => {
    const mockSliderChange = new MatSliderChange();
    mockSliderChange.value = null;

    paintBucketTool.tolerance = 0;
    component.tolerance = 0;
    component.onToleranceSliderChange(mockSliderChange);
    expect(component.tolerance).toBe(0);
    expect(paintBucketTool.tolerance).toBe(0);

    mockSliderChange.value = 1;
    component.onToleranceSliderChange(mockSliderChange);
    expect(component.tolerance).toBe(mockSliderChange.value);
    expect(paintBucketTool.tolerance).toBe(mockSliderChange.value);
  });

});
