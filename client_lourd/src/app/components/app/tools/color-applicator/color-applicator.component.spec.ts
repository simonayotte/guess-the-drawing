import { Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '../color-picker/color';
import { ColorApplicatorComponent } from './color-applicator.component';

const COLOR_APPLICATOR_SERVICE = 'colorApplicatorService';
describe('ColorApplicatorComponent', () => {
  let component: ColorApplicatorComponent;
  let fixture: ComponentFixture<ColorApplicatorComponent>;
  let renderer: Renderer2;
  const mockColor = new Color( 0, 0, 0, 0);
  const mockMouseEvent = new MouseEvent('onMouseDown');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorApplicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorApplicatorComponent);
    component = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onMouseDownInElement should call onMouseDownInElement of colorApplicatorService', () => {
    spyOn(component[COLOR_APPLICATOR_SERVICE], 'onMouseDownInElement');
    component.onMouseDownInElement(mockMouseEvent, mockColor, mockColor);
    expect(component[COLOR_APPLICATOR_SERVICE].onMouseDownInElement).toHaveBeenCalledTimes(1);
  });

  it('onMouseDownInElement should call onMouseDownInElement of colorApplicatorService', () => {
    spyOn(component[COLOR_APPLICATOR_SERVICE], 'onRightMouseDownInElement');
    component.onRightMouseDownInElement(mockMouseEvent, mockColor);
    expect(component[COLOR_APPLICATOR_SERVICE].onRightMouseDownInElement).toHaveBeenCalledTimes(1);
  });

  it('intializeRenderer should call initializeRenderer of colorApplicatorService', () => {
    spyOn(component[COLOR_APPLICATOR_SERVICE], 'initializeRenderer');
    component.initializeRenderer(renderer);
    expect(component[COLOR_APPLICATOR_SERVICE].initializeRenderer).toHaveBeenCalled();
  });
});
