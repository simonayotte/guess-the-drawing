import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FailedToGet2DContextError } from '../../../../../errors/failed-to-get-two-d-context';
import { Color } from '../color';
import { ColorSliderComponent } from './color-slider.component';

const CTX = 'ctx';
const SELECTED_HEIGHT = 'selectedHeight';
const MOUSE_DOWN = 'mouseDown';
const DIMENSION_STRING = 'dimensions';
const DIMENSION = {width: 150, height: 150};
const COLOR_PICKER_SERVICE = 'colorPickerService';
const BIG_HEIGHT = 1000;
const SMALL_HEIGHT = 0;
const OK_HEIGHT = 100;
const MAX_HEIGHT_PERCENT = 0.9999;
const MIN_HEIGHT_PERCENT = 0.0001;
const contextError = 'Failed to get 2D context';

describe('ColorSliderComponent', () => {
  let component: ColorSliderComponent;
  let fixture: ComponentFixture<ColorSliderComponent>;
  const mockMouseEvent = new MouseEvent('mouseEvent');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('drawColorSlider should call functions to create the slider', () => {
    spyOn(component[COLOR_PICKER_SERVICE], 'generatePerfectGradient');
    spyOn(component[CTX], 'beginPath');
    spyOn(component[CTX], 'rect');
    spyOn(component[CTX], 'fill');
    spyOn(component[CTX], 'closePath');

    component.drawColorSlider({width: DIMENSION.width, height: DIMENSION.height});
    expect(component[COLOR_PICKER_SERVICE].generatePerfectGradient).toHaveBeenCalled();
    expect(component[CTX].beginPath).toHaveBeenCalled();
    expect(component[CTX].rect).toHaveBeenCalled();
    expect(component[CTX].fill).toHaveBeenCalled();
    expect(component[CTX].closePath).toHaveBeenCalled();
  });

  it('drawKnow should draw the know if selectedHeight is defined', () => {
    component[SELECTED_HEIGHT] = 1;
    spyOn(component[CTX], 'beginPath');
    spyOn(component[CTX], 'rect');
    spyOn(component[CTX], 'stroke');
    spyOn(component[CTX], 'closePath');

    component.drawKnob(DIMENSION.width);
    expect(component[CTX].beginPath).toHaveBeenCalled();
    expect(component[CTX].stroke).toHaveBeenCalled();
    expect(component[CTX].rect).toHaveBeenCalled();
    expect(component[CTX].closePath).toHaveBeenCalled();
  });

  it('onMouseMove should call clickRefresh if the mouse is down', () => {
    component[MOUSE_DOWN] = true;
    spyOn(component, 'clickRefresh');
    component.onMouseMove(mockMouseEvent);
    expect(component.clickRefresh).toHaveBeenCalled();
  });

  it('onMouseMove should not have been call clickRefresh if the mouse is not down', () => {
    component[MOUSE_DOWN] = false;
    spyOn(component, 'clickRefresh');
    component.onMouseMove(mockMouseEvent);
    expect(component.clickRefresh).toHaveBeenCalledTimes(0);
  });

  it('onMouseDown should set mouseDOwn to true and call clickRefresh()', () => {
    spyOn(component, 'clickRefresh');
    component.onMouseDown(mockMouseEvent);
    expect(component[MOUSE_DOWN]).toBe(true);
    expect(component.clickRefresh).toHaveBeenCalled();
  });

  it('onMouseUp should set mouseDOwn to false', () => {
    component.onMouseUp(mockMouseEvent);
    expect(component[MOUSE_DOWN]).toBe(false);
  });

  it('clickRefresh should call setHeight(), getPixelColorFromImage(), and refresh()', () => {
    spyOn(component, 'setHeight');
    spyOn(component, 'refresh');
    spyOn(component[COLOR_PICKER_SERVICE], 'getPixelColorFromImage');
    component.clickRefresh(mockMouseEvent);
    expect(component.setHeight).toHaveBeenCalled();
    expect(component.refresh).toHaveBeenCalled();
    expect(component[COLOR_PICKER_SERVICE].getPixelColorFromImage).toHaveBeenCalled();
  });

  it('refresh should call draw() and and update the hueManuel color', () => {
    spyOn(component, 'draw');
    spyOn(component[COLOR_PICKER_SERVICE].hueClick, 'next');
    component.refresh(mockMouseEvent, new Color(0, 0, 0, 0));
    expect(component.draw).toHaveBeenCalled();
    expect(component[COLOR_PICKER_SERVICE].hueClick.next).toHaveBeenCalled();
  });

  it('setHeight should set selectedHeight to maxHeightPercent * dimensions.height is the heigth is to high', () => {
    component[DIMENSION_STRING].width = DIMENSION.width;
    component[DIMENSION_STRING].height = DIMENSION.height;
    component.setHeight(BIG_HEIGHT);
    expect(component[SELECTED_HEIGHT]).toBe(MAX_HEIGHT_PERCENT * component[DIMENSION_STRING].height);
  });

  it('setHeight should set selectedHeight to minHeightPercent * dimensions.height is the heigth is to small', () => {
    component[DIMENSION_STRING].width = DIMENSION.width;
    component[DIMENSION_STRING].height = DIMENSION.height;
    component.setHeight(SMALL_HEIGHT);
    expect(component[SELECTED_HEIGHT]).toBe(MIN_HEIGHT_PERCENT * component[DIMENSION_STRING].height);
  });

  it('setHeight should only set the height if it is within the borders', () => {
    component[DIMENSION_STRING].width = DIMENSION.width;
    component[DIMENSION_STRING].height = DIMENSION.height;
    component.setHeight(OK_HEIGHT);
    expect(component[SELECTED_HEIGHT]).toBe(OK_HEIGHT);
  });

  it('valueChangeRefresh should call setHeight, draw, getPixelColrFromImage and Next', () => {
    spyOn(component, 'draw');
    spyOn(component[COLOR_PICKER_SERVICE].hueManual, 'next');
    spyOn(component[COLOR_PICKER_SERVICE], 'getPixelColorFromImage');
    spyOn(component, 'setHeight');

    component.valueChangeRefresh(new Color(0, 0, 0, 0));

    expect(component[COLOR_PICKER_SERVICE].hueManual.next).toHaveBeenCalled();
    expect(component[COLOR_PICKER_SERVICE].getPixelColorFromImage).toHaveBeenCalled();
    expect(component.draw).toHaveBeenCalled();
    expect(component.setHeight).toHaveBeenCalled();
  });

  it('draw should call drawColorSlider and drawKnowb if the ctx is defined', () => {
    spyOn(component, 'drawColorSlider');
    spyOn(component, 'drawKnob');
    spyOn(component.slider.nativeElement, 'getContext');

    component.draw();

    expect(component.slider.nativeElement.getContext).toHaveBeenCalledTimes(0);
    expect(component.drawColorSlider).toHaveBeenCalledTimes(1);
    expect(component.drawKnob).toHaveBeenCalledTimes(1);
  });

  it('draw should throw an error if getContext return null or not an instanceof CanvasRenderingContext2D', () => {
    component[CTX] = null as unknown as CanvasRenderingContext2D;
    spyOn(component.slider.nativeElement, 'getContext').and.returnValue(null);
    expect(() => {component.draw(); }).toThrow(new FailedToGet2DContextError(contextError));
  });
});
