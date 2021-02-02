import { DebugElement, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { EraserComponent } from './eraser.component';

describe('EraserComponent', () => {
  let component: EraserComponent;
  let renderer: Renderer2;
  let fixture: ComponentFixture<EraserComponent>;
  let debugElement: DebugElement;
  const ERASER_SERVICE = 'eraserService';
  const IS_VALID_SIZE = 'isValidSize';
  const DEFAULT_BACKGROUND = 'rgb(255, 255, 255)';
  const ERROR_BACKGROUND = 'rgb(255, 110, 110)';

  const FUNCTION_ARRAY = ['onMouseMove', 'onMouseDownInElement', 'onMouseUp', 'onMouseLeave', 'onMouseEnter'];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserComponent);
    component = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('initializerenderer should call initializeRenderer() from eraserService', () => {
    spyOn(component[ERASER_SERVICE], 'initializeRenderer');

    component.initializeRenderer(renderer);
    expect(component[ERASER_SERVICE].initializeRenderer).toHaveBeenCalled();

  });
  it('every function in component should call respective function in service', () => {
    const mockMouseEvent = new MouseEvent('mouseEvent');
    const SPY_ARRAY = [];
    for (const func of FUNCTION_ARRAY) {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
      SPY_ARRAY.push(spyOn<any>(component[ERASER_SERVICE], func).and.callFake(() => {return; }));
    }
    component.onMouseMove(mockMouseEvent);
    component.onMouseDownInElement(mockMouseEvent);
    component.onMouseUp(mockMouseEvent);
    component.onMouseLeave(mockMouseEvent);
    component.onMouseEnter(mockMouseEvent);
    for (const spy of SPY_ARRAY) {
      expect(spy).toHaveBeenCalled();
    }
  });
  it('isValidsize should return true if the input is valid', () => {
    const value1: number | null = 2;
    const value2 = 251;
    const value3 = -10;
    expect(component[IS_VALID_SIZE](value1)).toBeFalsy();
    expect(component[IS_VALID_SIZE](value2)).toBeFalsy();
    expect(component[IS_VALID_SIZE](value3)).toBeFalsy();
  });
  it('onSliderChange shoudl set the size value', () => {
    const event = {} as MatSliderChange;
    const value = 10;
    event.value = value;
    component[ERASER_SERVICE].eraserSize.next = jasmine.createSpy().and.returnValue(true);
    component.onSliderChange(event);
    expect(component[ERASER_SERVICE].eraserSize.next).toHaveBeenCalledWith(value);
  });
  it('onSliderChange shoudl set the size value', () => {
    const event = {} as MatSliderChange;
    event.value = null;
    component[ERASER_SERVICE].eraserSize.next = jasmine.createSpy().and.returnValue(true);
    component.onSliderChange(event);
    expect(component[ERASER_SERVICE].eraserSize.next).not.toHaveBeenCalled();
  });
  it('onValueChange should stop propagation and set size if valued else min size', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);
    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'isValidSize').and.returnValue(true);
    component.onValueChange(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component[IS_VALID_SIZE]).toHaveBeenCalled();
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });
  it('onValueChange should stop propagation and set size if valued else min size', () => {
    const MIN_SIZE = 3;
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);
    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'isValidSize').and.returnValue(false);
    component.onValueChange(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component[IS_VALID_SIZE]).toHaveBeenCalled();
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
    expect(component.size).toBe(MIN_SIZE);
  });
  it('onInput should set background color to default and set size to the value entered for eraser size if isValidSize true', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'isValidSize').and.returnValue(true);

    component.onInput(mockEvent);
    expect(component.size).toBe(+(mockEvent.target as HTMLInputElement).value);
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(DEFAULT_BACKGROUND);
  });
  it('onInput should call stopImediatePropagation, set size to the default one for eraser size \
      type and set background color to error if isValidSize false', () => {
    const element = debugElement.query(By.css('input')).nativeElement;
    const mockEvent: Event = new Event('myevent');
    element.dispatchEvent(mockEvent);

    spyOn(mockEvent, 'stopImmediatePropagation');
    spyOn(component.sizeInput.nativeElement.style, 'backgroundColor');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(component, 'isValidSize').and.returnValue(false);

    component.onInput(mockEvent);
    expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(component.sizeInput.nativeElement.style.backgroundColor).toBe(ERROR_BACKGROUND);
  });
});
