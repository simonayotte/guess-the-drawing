import { DebugElement, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxChange, MatSliderChange } from '@angular/material';
import { By } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SelectedColorsService } from 'src/app/services/color-picker/selected-colors.service';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { CommandInvokerService } from 'src/app/services/drawing/command-invoker.service';
import { DrawingSizeService } from 'src/app/services/drawing/drawing-size.service';
import { GallerieDrawingService } from 'src/app/services/gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from 'src/app/services/svg-service/svg.service';
import { LineService } from 'src/app/services/tools/line-service/line.service';
import { PathDrawingService } from 'src/app/services/tools/path-drawing/path-drawing.service';
import { EraserService } from '../../../../services/tools/eraser-service/eraser.service';
import { Color } from '../color-picker/color';
import { LineToolComponent } from './line-tool.component';

const LINE_SERVICE = 'lineService';
const LINE_SIZE = 'LineSize';
const OTHER_INPUT = 'otherInput';
const HIGH_PIXELS = 255;
const MAX_SIZE = 50;
const LESS_THAN_MIN = 0;
const MORE_THAN_MAX = 300;
const NOT_A_NUMBER = Number('a string');
const VALID_NUMBER = 20;
const DEFAULT_LINE_SIZE = 5;
const DEFAULT_JUNCTION_SIZE = 10;
const A_VALUE = 10;

const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
const ERROR_BACKGROUND = 'rgb(255, 110, 110)';

describe('LineToolComponent', () => {
  let renderer: Renderer2;
  let component: LineToolComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<LineToolComponent>;
  const path: SVGPathElement = {} as SVGPathElement;
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const lineTool = new LineToolComponent(new LineService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing),
    new EraserService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineToolComponent);
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.tool = lineTool;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // onSizeSliderChange
  it('onSizeSliderChange should set tool.size and size to event.size', () => {
    const mockEvent: MatSliderChange = new MatSliderChange();
    mockEvent.value = A_VALUE;
    component.size = 0;
    component.tool.size = 0;

    component.onSizeSliderChange(mockEvent);

    expect(component.size).toBe(mockEvent.value);
    expect(component.tool.size).toBe(mockEvent.value);
  });

  it('onSizeSliderChange should not set tool.size and size to event.size', () => {
    const mockEvent: MatSliderChange = new MatSliderChange();
    mockEvent.value = null;
    component.size = 0;
    component.tool.size = 0;

    component.onSizeSliderChange(mockEvent);

    expect(component.size).toBe(0);
    expect(component.tool.size).toBe(0);
  });

  // onJunctionChange
  it('onJunctionChange should change tool.hasJunctionChange', () => {
    const mockCheckboxEvent: MatCheckboxChange = new MatCheckboxChange();
    mockCheckboxEvent.checked = true;
    component.tool.hasJunctionPoints = false;

    component.onJunctionChange(mockCheckboxEvent);

    expect(component.tool.hasJunctionPoints).toBe(true);
  });

  it('onJunctionChange should not change tool.hasJunctionChange', () => {
    const mockCheckboxEvent = jasmine.createSpyObj('checkBoxEvent', ['checked']);
    mockCheckboxEvent.checked = null;
    component.tool.hasJunctionPoints = false;

    component.onJunctionChange(mockCheckboxEvent);

    expect(component.tool.hasJunctionPoints).toBe(false);
  });

  // onJunctionSliderChange
  it('onJunctionSliderChange should change junctionDiameter and tool.junctionDiameter when event.value isn t null', () => {
    const mockEvent: MatSliderChange = new MatSliderChange();
    mockEvent.value = A_VALUE;

    component.onJunctionSliderChange(mockEvent);

    expect(component.junctionDiameter).toBe(mockEvent.value);
    expect(component.tool.junctionDiameter).toBe(mockEvent.value);
  });

  // onJunctionSliderChange
  it('onJunctionSliderChange should not  change junctionDiameter and tool.junctionDiameter when event.value isn t null', () => {
    const mockEvent: MatSliderChange = new MatSliderChange();
    mockEvent.value = null;
    component.junctionDiameter = A_VALUE;
    component.tool.junctionDiameter = A_VALUE;

    component.onJunctionSliderChange(mockEvent);

    expect(component.junctionDiameter).toBe(A_VALUE);
    expect(component.tool.junctionDiameter).toBe(A_VALUE);
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from lineService', () => {
    spyOn(component[LINE_SERVICE], 'initializeRenderer');

    component.initializeRenderer(renderer);
    expect(component[LINE_SERVICE].initializeRenderer).toHaveBeenCalled();

  });

  // onMouseDownInElement
  it('onMouseDownInElement should call onMouseDown from lineService', () => {
    const mockMouseDown = new MouseEvent('onMouseDownInElement');
    spyOn(component[LINE_SERVICE], 'onMouseDownInElement');

    component.onMouseDownInElement(mockMouseDown);
    expect(component[LINE_SERVICE].onMouseDownInElement).toHaveBeenCalled();
  });

  // onMouseDown
  it('onMouseDown should call onMouseDown from lineService', () => {
    const mockMouseDown = new MouseEvent('onMouseDown');
    const color = new Color(HIGH_PIXELS, HIGH_PIXELS, HIGH_PIXELS, 1);
    spyOn(component[LINE_SERVICE], 'onMouseDown').and.returnValue(path);

    component.onMouseDown(mockMouseDown, color);
    expect(component[LINE_SERVICE].onMouseDown).toHaveBeenCalled();
  });

  // onMouseMove
  it('onMouseMove should call onMouseMove from lineService', () => {
    const mockMove = new MouseEvent('mousemove');
    spyOn(component[LINE_SERVICE], 'onMouseMove').and.returnValue(path);

    component.onMouseMove(mockMove);
    expect(component[LINE_SERVICE].onMouseMove).toHaveBeenCalled();

  });

  // onDoubleClick
  it('onDoubleClick should call onDoubleClick from lineService', () => {
    const mockMove = new MouseEvent('onDoubleClick');
    spyOn(component[LINE_SERVICE], 'onDoubleClick').and.returnValue(path);

    component.onDoubleClick(mockMove);
    expect(component[LINE_SERVICE].onDoubleClick).toHaveBeenCalled();

  });

  // onBackspaceDown
  it('onBackspaceDown should call onBackspaceDown from lineService', () => {
    const mockShiftUp = new KeyboardEvent('onBackspaceDown');
    spyOn(component[LINE_SERVICE], 'onBackspaceDown').and.returnValue(path);

    component.onBackspaceDown(mockShiftUp);
    expect(component[LINE_SERVICE].onBackspaceDown).toHaveBeenCalled();

  });

  // onEscapeClick
  it('onEscapeClick should call onEscapeClick from lineService', () => {
    const mockShiftUp = new KeyboardEvent('onEscapeClick');
    spyOn(component[LINE_SERVICE], 'onEscapeClick').and.returnValue(path);

    component.onEscapeClick(mockShiftUp);
    expect(component[LINE_SERVICE].onEscapeClick).toHaveBeenCalled();

  });

  // onShiftDown
  it('onShiftDown should call onShiftDown from lineService', () => {
    const mockShiftDown = new KeyboardEvent('onShiftDown');
    spyOn(component[LINE_SERVICE], 'onShiftDown').and.returnValue(path);

    component.onShiftDown(mockShiftDown);
    expect(component[LINE_SERVICE].onShiftDown).toHaveBeenCalled();

  });

  // onShiftUp
  it('onShiftUp should call onShiftUp from lineService', () => {
    const mockShiftUp = new KeyboardEvent('onShiftUp');
    spyOn(component[LINE_SERVICE], 'onShiftUp').and.returnValue(path);

    component.onShiftUp(mockShiftUp);
    expect(component[LINE_SERVICE].onShiftUp).toHaveBeenCalled();

  });

  // onMouseEnter
  it('onMouseEnter should call onMouseEnter from lineService', () => {
    const mockEnter = new MouseEvent('mouseenter');
    spyOn(component[LINE_SERVICE], 'onMouseEnter').and.returnValue(path);

    component.onMouseEnter(mockEnter);
    expect(component[LINE_SERVICE].onMouseEnter).toHaveBeenCalled();

  });

  // onMouseLeave
  it('onMouseLeave should call onMouseLeave from lineService', () => {
    const mockLeave = new MouseEvent('mouseleave');
    spyOn(component[LINE_SERVICE], 'onMouseLeave').and.returnValue(path);

    component.onMouseLeave(mockLeave);
    expect(component[LINE_SERVICE].onMouseLeave).toHaveBeenCalled();

  });

  // onValueChange
  it('onValueChange should call stopPropagation, set background color to default and set size to \
      the value entered for lineSize type if isValidSize is true', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onValueChange(mockEvent, LINE_SIZE);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.isValidSize).toHaveBeenCalled();
    expect(lineTool.size).toBe(+(mockEvent.target as HTMLInputElement).value);
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  // onValueChange
  it('onValueChange should set background color to default and set size to \
      default one for lineSiize type if isValidSize false', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onValueChange(mockEvent, LINE_SIZE);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.isValidSize).toHaveBeenCalled();
    expect(component.size).toBe(DEFAULT_LINE_SIZE);
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

   // onValueChange
  it('onValueChange should call stopPropagation, set background color to default and set size to \
   the value entered for OTHER_INPUT type if isValidSize is true', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onValueChange(mockEvent, OTHER_INPUT);
    expect(component.isValidSize).toHaveBeenCalled();
    expect(lineTool.junctionDiameter).toBe(+(mockEvent.target as HTMLInputElement).value);
    expect(component.junctionDiameterInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

   // onValueChange
  it('onValueChange should set background color to default and set size to \
   default one for lineSiize type if isValidSize false', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onValueChange(mockEvent, OTHER_INPUT);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.isValidSize).toHaveBeenCalled();
    expect(component.junctionDiameter).toBe(DEFAULT_JUNCTION_SIZE);
    expect(component.junctionDiameterInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  // isValidSize
  it('isValidSize should verify if the size is in a range and if its a number', () => {

    let returnedValue = component.isValidSize(LESS_THAN_MIN, MAX_SIZE);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSize(MORE_THAN_MAX, MAX_SIZE);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSize(NOT_A_NUMBER, MAX_SIZE);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSize(VALID_NUMBER, MAX_SIZE);
    expect(returnedValue).toBe(true);
  });

  // onInput
  it('onInput should set background color to default and set size to the value entered for linetool size if isValidSize true', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onInput(mockEvent, LINE_SIZE);
    expect(lineTool.size).toBe(+(mockEvent.target as HTMLInputElement).value);
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  // onInput
  it('onInput should call stopImediatePropagation, set size to the default one for linetool size \
      type and set background color to error if isValidSize false', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onInput(mockEvent, LINE_SIZE);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
    expect(lineTool.size).toBe(DEFAULT_LINE_SIZE);
  });

  // onInput
  it('onInput should set background color to default and set size to the value entered for linetool junctionDiameter \
      if isValidSize true', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onInput(mockEvent, OTHER_INPUT);
    expect(lineTool.junctionDiameter).toBe(+(mockEvent.target as HTMLInputElement).value);
    expect(component.junctionDiameterInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  // onInput
  it('onInput should set size to the default one for linetool junctionDiameter \
      type and set background color to error if isValidSize false', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onInput(mockEvent, OTHER_INPUT);
    expect(component.junctionDiameterInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
    expect(lineTool.junctionDiameter).toBe(DEFAULT_JUNCTION_SIZE);
  });
// We disable this tslint rule because this is a test file and the number of lines is not important
// tslint:disable-next-line: max-file-line-count
});
