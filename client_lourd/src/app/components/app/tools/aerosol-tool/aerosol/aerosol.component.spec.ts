import { DebugElement, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material';
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
import { AerosolService } from 'src/app/services/tools/aerosol-service/aerosol.service';
import { PathDrawingService } from 'src/app/services/tools/path-drawing/path-drawing.service';
import { EraserService } from '../../../../../services/tools/eraser-service/eraser.service';
import { Color } from '../../color-picker/color';
import { AerosolComponent } from './aerosol.component';

const AEROSOL_SERVICE = 'aerosolService';
const ON_MOUSE_DOWN_IN_ELEMENT = 'onMouseDownInElement';
const INITIALIZE_RENDERER = 'initializeRenderer';
const ON_MOUSE_MOVE = 'onMouseMove';
const ON_MOUSE_UP = 'onMouseUp';
const DIAMETER = 'Diameter';
const EMISSION_SPEED = 'emissionSpeed';
const DEFAULT_DIAMETER = 5;
const DEFAULT_EMISSION = 200;

const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
const ERROR_BACKGROUND = 'rgb(255, 110, 110)';
describe('AerosolComponent', () => {
  let component: AerosolComponent;
  let renderer: Renderer2;
  let fixture: ComponentFixture<AerosolComponent>;
  let debugElement: DebugElement;
  const mockMouseEvent: MouseEvent = new MouseEvent('Click');
  const mockColor = new Color(1, 1, 1, 1);
  const mockSliderEvent: MatSliderChange = new MatSliderChange();
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const aerosolTool = new AerosolComponent(new AerosolService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing),
    new EraserService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AerosolComponent);
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.tool = aerosolTool;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isValidSize should true if the size if between the boundaries', () => {
    const maxValue = 100;
    const minValue = 1;
    const testValue = 10;
    const validSide = component.isValidSize(testValue, maxValue, minValue);
    expect(validSide).toBeGreaterThanOrEqual(minValue);
    expect(validSide).toBeLessThanOrEqual(maxValue);
  });

  it('initializerenderer should call initializeRenderer() from aerosolService', () => {
    spyOn(component[AEROSOL_SERVICE], INITIALIZE_RENDERER);

    component.initializeRenderer(renderer);
    expect(component[AEROSOL_SERVICE].initializeRenderer).toHaveBeenCalled();

  });

  it('onMouseDownInElement should call onMouseDownInElement froma aerosolService', () => {
    spyOn(component[AEROSOL_SERVICE], ON_MOUSE_DOWN_IN_ELEMENT);

    component.onMouseDownInElement(mockMouseEvent, mockColor, mockColor);

    expect(component[AEROSOL_SERVICE].onMouseDownInElement).toHaveBeenCalled();
  });

  it('onMouseMove should call onMouseMove froma aerosolService', () => {
    spyOn(component[AEROSOL_SERVICE], ON_MOUSE_MOVE);

    component.onMouseMove(mockMouseEvent);

    expect(component[AEROSOL_SERVICE].onMouseMove).toHaveBeenCalled();
  });

  it('onMouseUp should call onMouseUp froma aerosolService', () => {
    spyOn(component[AEROSOL_SERVICE], ON_MOUSE_UP);

    component.onMouseUp(mockMouseEvent);

    expect(component[AEROSOL_SERVICE].onMouseUp).toHaveBeenCalled();
  });

  it('onDiameterSliderChange should not set tool.diameter and diameter to event.diameter if its null', () => {
    mockSliderEvent.value = null;
    component.diameter = 0;
    component.tool.diameter = 0;

    component.onDiameterSliderChange(mockSliderEvent);

    expect(component.diameter).toBe(0);
    expect(component.tool.diameter).toBe(0);
  });

  it('onDiameterSliderChange should set tool.diameter and diameter to event.diameter if the value is valid', () => {
    const testValue = 10;

    mockSliderEvent.value = testValue;
    component.diameter = 0;
    component.tool.diameter = 0;

    component.onDiameterSliderChange(mockSliderEvent);

    expect(component.diameter).toBe(testValue);
    expect(component.tool.diameter).toBe(testValue);
  });

  it('onEmissionSpeedChange should set tool.emissionPerSecond and emissionPerSecond to event.value if the value is valid', () => {
    const testValue = 50;

    mockSliderEvent.value = testValue;
    component.emissionPerSecond = 0;
    component.tool.emissionPerSecond = 0;

    component.onEmissionSpeedSliderChange(mockSliderEvent);

    expect(component.emissionPerSecond).toBe(testValue);
    expect(component.tool.emissionPerSecond).toBe(testValue);
  });

  it('onEmissionSpeedChange should not set tool.emissionPerSecond and emissionPerSecond to event.value if the value is invalid', () => {
    mockSliderEvent.value = null;
    component.emissionPerSecond = 0;
    component.tool.emissionPerSecond = 0;

    component.onEmissionSpeedSliderChange(mockSliderEvent);

    expect(component.emissionPerSecond).toBe(0);
    expect(component.tool.emissionPerSecond).toBe(0);
  });

  it('onValueChange should call stopPropagation, set background color to default and set diameter to \
      the value entered for diameter type if the value is valid', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.diameterInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onValueChange(mockEvent, DIAMETER);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.isValidSize).toHaveBeenCalled();
    expect(aerosolTool.diameter).toBe(+(mockEvent.target as HTMLInputElement).value);
    expect(component.diameterInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  // onValueChange
  it('onValueChange should call stopPropagation, set background color to default and set diameter to \
      default if the value is invalid', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.diameterInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onValueChange(mockEvent, DIAMETER);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.isValidSize).toHaveBeenCalled();
    expect(component.diameter).toBe(DEFAULT_DIAMETER);
    expect(component.diameterInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  it('onValueChange should call stopPropagation, set background color to default and set emissionSpeed to \
      the value entered if the value is valid', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.emissionSpeedInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onValueChange(mockEvent, EMISSION_SPEED);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.isValidSize).toHaveBeenCalled();
    expect(aerosolTool.emissionPerSecond).toBe(+((mockEvent.target as HTMLInputElement).value));
    expect(component.emissionSpeedInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  it('onValueChange should call stopPropagation, set background color to default and set emissionSpeed to \
      the default value if the value is invalid', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.diameterInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onValueChange(mockEvent, EMISSION_SPEED);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.isValidSize).toHaveBeenCalled();
    expect(component.emissionPerSecond).toBe(DEFAULT_EMISSION);
    expect(component.emissionSpeedInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  it('onInput should set background color to default and set diameter to the value entered if the size is valid', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.diameterInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onInput(mockEvent, DIAMETER);
    expect(aerosolTool.diameter).toBe(+((mockEvent.target as HTMLInputElement).value));
    expect(component.diameterInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  it('onInput should call stopImediatePropagation, set diameter to the default value \
      type and set background color to error if isValidSize false', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.diameterInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onInput(mockEvent, DIAMETER);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.diameterInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
    expect(aerosolTool.diameter).toBe(DEFAULT_DIAMETER);
  });

  it('onInput should set background color to default and set emissionSpeed to the value entered if the size is valid', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.diameterInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onInput(mockEvent, EMISSION_SPEED);
    expect(aerosolTool.emissionPerSecond).toBe(+((mockEvent.target as HTMLInputElement).value));
    expect(component.emissionSpeedInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });

  it('onInput should call stopImediatePropagation, set emissionSpeed to the default value \
       and set background color to error if isValidSize false', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.emissionSpeedInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(false);

    component.onInput(mockEvent, EMISSION_SPEED);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.emissionSpeedInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
    expect(aerosolTool.emissionPerSecond).toBe(DEFAULT_EMISSION);
  });

});
