import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { Color } from '../../color-picker/color';
import { RectangleToolComponent } from './rectangle-tool.component';

const RECTANGLE_SERVICE = 'rectangleService';

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

describe('RectangleToolComponent', () => {
  let renderer: Renderer2;
  let component: RectangleToolComponent;
  let fixture: ComponentFixture<RectangleToolComponent>;
  const path: SVGPathElement = {} as SVGPathElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Renderer2, useClass: MockRenderer2}],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleToolComponent);
    renderer = TestBed.get(Renderer2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from rectangleService', () => {
    spyOn(component[RECTANGLE_SERVICE], 'initializeRenderer');

    component.initializeRenderer(renderer);
    expect(component[RECTANGLE_SERVICE].initializeRenderer).toHaveBeenCalled();

  });

  // onMouseDownInElement
  it('onMouseDownInElement should call onMouseDown from rectangleService', () => {
    const mockMouseDown = new MouseEvent('onMouseDownInElement');
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(component[RECTANGLE_SERVICE], 'onMouseDownInElement').and.returnValue(path);

    component.onMouseDownInElement(mockMouseDown, mockColor, mockColor);
    expect(component[RECTANGLE_SERVICE].onMouseDownInElement).toHaveBeenCalled();
  });

  // onMouseDown
  it('onMouseDown should call onMouseDown from rectangleService', () => {
    const mockMouseDown = new MouseEvent('onMouseDown');
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(component[RECTANGLE_SERVICE], 'onMouseDown').and.returnValue(path);

    component.onMouseDown(mockMouseDown, mockColor, mockColor);
    expect(component[RECTANGLE_SERVICE].onMouseDown).toHaveBeenCalled();
  });

  // onMouseUp
  it('onMouseUp should call onMouseUp from rectangleService', () => {
    const mockMouseUp = new MouseEvent('onMouseUp');
    spyOn(component[RECTANGLE_SERVICE], 'onMouseUp').and.returnValue(path);

    component.onMouseUp(mockMouseUp);
    expect(component[RECTANGLE_SERVICE].onMouseUp).toHaveBeenCalled();

  });

  // onShiftDown
  it('onShiftDown should call onShiftDown from rectangleService', () => {
    const mockShiftDown = new KeyboardEvent('onShiftDown');
    spyOn(component[RECTANGLE_SERVICE], 'onShiftDown').and.returnValue(path);

    component.onShiftDown(mockShiftDown);
    expect(component[RECTANGLE_SERVICE].onShiftDown).toHaveBeenCalled();

  });

  // onShiftUp
  it('onShiftUp should call onShiftUp from rectangleService', () => {
    const mockShiftUp = new KeyboardEvent('onShiftUp');
    spyOn(component[RECTANGLE_SERVICE], 'onShiftUp').and.returnValue(path);

    component.onShiftUp(mockShiftUp);
    expect(component[RECTANGLE_SERVICE].onShiftUp).toHaveBeenCalled();

  });

  // onMouseMove
  it('onMouseMove should call onMouseMove from rectangleService', () => {
    const mockMove = new MouseEvent('mousemove');
    spyOn(component[RECTANGLE_SERVICE], 'onMouseMove').and.returnValue(path);

    component.onMouseMove(mockMove);
    expect(component[RECTANGLE_SERVICE].onMouseMove).toHaveBeenCalled();

  });

  // onMouseLeave
  it('onMouseLeave should call onMouseLeave from rectangleService', () => {
    const mockLeave = new MouseEvent('mouseleave');
    spyOn(component[RECTANGLE_SERVICE], 'onMouseLeave').and.returnValue(path);

    component.onMouseLeave(mockLeave);
    expect(component[RECTANGLE_SERVICE].onMouseLeave).toHaveBeenCalled();

  });

  // onMouseEnter
  it('onMouseEnter should call onMouseEnter from rectangleService', () => {
    const mockEnter = new MouseEvent('mouseenter');
    spyOn(component[RECTANGLE_SERVICE], 'onMouseEnter').and.returnValue(path);

    component.onMouseEnter(mockEnter);
    expect(component[RECTANGLE_SERVICE].onMouseEnter).toHaveBeenCalled();

  });

});
