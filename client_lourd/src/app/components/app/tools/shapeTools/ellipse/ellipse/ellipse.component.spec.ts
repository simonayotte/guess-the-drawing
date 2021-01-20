import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { Color } from '../../../color-picker/color';
import { EllipseComponent } from './ellipse.component';

const ELLIPSE_SERVICE = 'ellipseService';
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

describe('EllipseComponent', () => {
  let component: EllipseComponent;
  let fixture: ComponentFixture<EllipseComponent>;
  const path: SVGPathElement = {} as SVGPathElement;
  let renderer: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Renderer2, useClass: MockRenderer2}],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipseComponent);
    renderer = TestBed.get(Renderer2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from ellipseService', () => {
    spyOn(component[ELLIPSE_SERVICE], 'initializeRenderer');

    component.initializeRenderer(renderer);
    expect(component[ELLIPSE_SERVICE].initializeRenderer).toHaveBeenCalled();

  });

  // onMouseDownInElement
  it('onMouseDownInElement should call onMouseDown from ellipseService', () => {
    const mockMouseDown = new MouseEvent('onMouseDownInElement');
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(component[ELLIPSE_SERVICE], 'onMouseDownInElement').and.returnValue(path);

    component.onMouseDownInElement(mockMouseDown, mockColor, mockColor);
    expect(component[ELLIPSE_SERVICE].onMouseDownInElement).toHaveBeenCalled();
  });

  // onMouseDown
  it('onMouseDown should call onMouseDown from ellipseService', () => {
    const mockMouseDown = new MouseEvent('onMouseDown');
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(component[ELLIPSE_SERVICE], 'onMouseDown').and.returnValue(path);

    component.onMouseDown(mockMouseDown, mockColor, mockColor);
    expect(component[ELLIPSE_SERVICE].onMouseDown).toHaveBeenCalled();
  });

  // onMouseUp
  it('onMouseUp should call onMouseUp from ellipseService', () => {
    const mockMouseUp = new MouseEvent('onMouseUp');
    spyOn(component[ELLIPSE_SERVICE], 'onMouseUp').and.returnValue(path);

    component.onMouseUp(mockMouseUp);
    expect(component[ELLIPSE_SERVICE].onMouseUp).toHaveBeenCalled();

  });

  // onShiftDown
  it('onShiftDown should call onShiftDown from ellipseService', () => {
    const mockShiftDown = new KeyboardEvent('onShiftDown');
    spyOn(component[ELLIPSE_SERVICE], 'onShiftDown').and.returnValue(path);

    component.onShiftDown(mockShiftDown);
    expect(component[ELLIPSE_SERVICE].onShiftDown).toHaveBeenCalled();

  });

  // onShiftUp
  it('onShiftUp should call onShiftUp from ellipseService', () => {
    const mockShiftUp = new KeyboardEvent('onShiftUp');
    spyOn(component[ELLIPSE_SERVICE], 'onShiftUp').and.returnValue(path);

    component.onShiftUp(mockShiftUp);
    expect(component[ELLIPSE_SERVICE].onShiftUp).toHaveBeenCalled();

  });

  // onMouseMove
  it('onMouseMove should call onMouseMove from ellipseService', () => {
    const mockMove = new MouseEvent('mousemove');
    spyOn(component[ELLIPSE_SERVICE], 'onMouseMove').and.returnValue(path);

    component.onMouseMove(mockMove);
    expect(component[ELLIPSE_SERVICE].onMouseMove).toHaveBeenCalled();

  });

  // onMouseLeave
  it('onMouseLeave should call onMouseLeave from ellipseService', () => {
    const mockLeave = new MouseEvent('mouseleave');
    spyOn(component[ELLIPSE_SERVICE], 'onMouseLeave').and.returnValue(path);

    component.onMouseLeave(mockLeave);
    expect(component[ELLIPSE_SERVICE].onMouseLeave).toHaveBeenCalled();

  });

  // onMouseEnter
  it('onMouseEnter should call onMouseEnter from ellipseService', () => {
    const mockEnter = new MouseEvent('mouseenter');
    spyOn(component[ELLIPSE_SERVICE], 'onMouseEnter').and.returnValue(path);

    component.onMouseEnter(mockEnter);
    expect(component[ELLIPSE_SERVICE].onMouseEnter).toHaveBeenCalled();

  });

});
