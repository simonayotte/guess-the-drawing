import { DebugElement, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { PathDrawingService } from 'src/app/services/tools/path-drawing/path-drawing.service';
import { PolygoneService } from 'src/app/services/tools/polygone-service/polygone.service';
import { EraserService } from '../../../../../../services/tools/eraser-service/eraser.service';
import { Color } from '../../../color-picker/color';
import { PolygoneComponent } from './polygone.component';

const POLYGONE_SERVICE = 'polygoneService';
const LESS_THAN_MIN = 0;
const MORE_THAN_MAX = 300;
const NOT_A_NUMBER = Number('a string');
const VALID_NUMBER = 6;
const DEFAULT_SIZE = 7;
const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
const ERROR_BACKGROUND = 'rgb(255, 110, 110)';

class MockRenderer2 {
  appendChild(): void {
    return;
  }
  setAttribute(): void {
    return;
  }
  createElement(): void {
    return;
  }
}

describe('PolygoneComponent', () => {
  let component: PolygoneComponent;
  let fixture: ComponentFixture<PolygoneComponent>;
  const path: SVGPathElement = {} as SVGPathElement;
  let debugElement: DebugElement;
  let renderer: Renderer2;
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const polygoneTool = new PolygoneComponent(new PolygoneService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing),
    new EraserService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Renderer2, useClass: MockRenderer2}],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    renderer = TestBed.get(Renderer2);
    component.tool = polygoneTool;
    debugElement = fixture.debugElement;
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
    spyOn(component, 'isValidSides').and.returnValue(false);

    component.onValueChange(mockEvent);
    expect(component.numberSides).toBe(DEFAULT_SIZE);
  });

  // onValueChange
  it('onValueChange should call stopPropagation, set background color to default and set size to the value entered', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sidesInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSize').and.returnValue(true);

    component.onValueChange(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.sidesInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(polygoneTool.numberSides).toBe(+(mockEvent.target as HTMLInputElement).value);
  });

  // onInput
  it('onInput should set size to the default one', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sidesInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSides').and.returnValue(false);

    component.onInput(mockEvent);
    expect(polygoneTool.numberSides).toBe(DEFAULT_SIZE);
    expect(component.sidesInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
  });

  // onInput
  it('onInput should call stopPropagation, set background color to default and set size to the value entered', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sidesInput.nativeElement.style, 'backgroundColor');
    spyOn(component, 'isValidSides').and.returnValue(true);

    component.onInput(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.sidesInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(polygoneTool.numberSides).toBe(+(mockEvent.target as HTMLInputElement).value);
  });

  // isValidSides
  it('isValidSides should verify if the size is in a range and if its a number', () => {

    let returnedValue = component.isValidSides(LESS_THAN_MIN);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSides(MORE_THAN_MAX);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSides(NOT_A_NUMBER);
    expect(returnedValue).toBe(false);

    returnedValue = component.isValidSides(VALID_NUMBER);
    expect(returnedValue).toBe(true);
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from polygoneService', () => {
    spyOn(component[POLYGONE_SERVICE], 'initializeRenderer');

    component.initializeRenderer(renderer);
    expect(component[POLYGONE_SERVICE].initializeRenderer).toHaveBeenCalled();

  });

  // onMouseDownInElement
  it('onMouseDownInElement should call onMouseDown from polygoneService', () => {
    const mockMouseDown = new MouseEvent('onMouseDownInElement');
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(component[POLYGONE_SERVICE], 'onMouseDownInElement').and.returnValue(path);

    component.onMouseDownInElement(mockMouseDown, mockColor, mockColor);
    expect(component[POLYGONE_SERVICE].onMouseDownInElement).toHaveBeenCalled();
  });

  // onMouseDown
  it('onMouseDown should call onMouseDown from polygoneService', () => {
    const mockMouseDown = new MouseEvent('onMouseDown');
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(component[POLYGONE_SERVICE], 'onMouseDown').and.returnValue(path);

    component.onMouseDown(mockMouseDown, mockColor, mockColor);
    expect(component[POLYGONE_SERVICE].onMouseDown).toHaveBeenCalled();
  });

  // onMouseUp
  it('onMouseUp should call onMouseUp from polygoneService', () => {
    const mockMouseUp = new MouseEvent('onMouseUp');
    spyOn(component[POLYGONE_SERVICE], 'onMouseUp').and.returnValue(path);

    component.onMouseUp(mockMouseUp);
    expect(component[POLYGONE_SERVICE].onMouseUp).toHaveBeenCalled();

  });

  // onMouseMove
  it('onMouseMove should call onMouseMove from polygoneService', () => {
    const mockMove = new MouseEvent('mousemove');
    spyOn(component[POLYGONE_SERVICE], 'onMouseMove').and.returnValue(path);

    component.onMouseMove(mockMove);
    expect(component[POLYGONE_SERVICE].onMouseMove).toHaveBeenCalled();

  });

  // onMouseLeave
  it('onMouseLeave should call onMouseLeave from polygoneService', () => {
    const mockLeave = new MouseEvent('mouseleave');
    spyOn(component[POLYGONE_SERVICE], 'onMouseLeave').and.returnValue(path);

    component.onMouseLeave(mockLeave);
    expect(component[POLYGONE_SERVICE].onMouseLeave).toHaveBeenCalled();

  });

  // onMouseEnter
  it('onMouseEnter should call onMouseEnter from polygoneService', () => {
    const mockEnter = new MouseEvent('mouseenter');
    spyOn(component[POLYGONE_SERVICE], 'onMouseEnter').and.returnValue(path);

    component.onMouseEnter(mockEnter);
    expect(component[POLYGONE_SERVICE].onMouseEnter).toHaveBeenCalled();

  });

});
