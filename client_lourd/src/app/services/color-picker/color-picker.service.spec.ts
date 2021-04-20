import { DebugElement, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorSliderComponent } from '../../components/app/tools/color-picker/color-slider/color-slider.component';
import { COLORS } from '../../components/app/tools/color-picker/constants';
import { ColorPickerService } from './color-picker.service';

const COORDINATES = {x: 0, y: 0};
const GET_IMAGE_DATA = 'getImageData';
const CREATE_LINEAR_GRADIENT = 'createLinearGradient';
const ADD_COLOR_STOP = 'addColorStop';
const R = 0;
const G = 0;
const B = 0;
const A = 0;
const RGBA_ARR = {data: [R, G, B, A]};
const WIDTH_KEY = 'width';
const HEIGHT_KEY = 'height';
const gradientStops = [COLORS.WHITE, COLORS.BLACK];
const WIDTH = 25;
const HEIGHT = 150;
const CANVAS_NAME = 'canvas';
const CONTEXT_DIMENSIONS = '2d';
const FAKE_CANVAS_GRADIENT = {addColorStop: () => {return; }};
const FAKE_VALUE_1 = '-1';
const FAKE_VALUE_2 = 'abc';
const FAKE_VALUE_3 = '11';
const FAKE_VALUE_4 = '5.6';
const FAKE_VALUE_5 = '';
const FAKE_VALUE_6 = '5';
const MIN = 0;
const MAX = 10;
const INVALID_HEX_1 = '#SSSSSS';
const INVALID_HEX_2 = '#ssssss';
const VALID_HEX = 'FFFFFF';

describe('ColorPickerService', () => {
  let service: ColorPickerService;
  let fixture: ComponentFixture<ColorSliderComponent>;
  let debugElement: DebugElement;
  let canvas: ElementRef<HTMLCanvasElement>;
  let element: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ColorSliderComponent]
    }).compileComponents();
    service = new ColorPickerService();
    fixture = TestBed.createComponent(ColorSliderComponent);
    debugElement = fixture.debugElement;
    canvas = debugElement.query(By.css(CANVAS_NAME));
    element = canvas.nativeElement;
    context = element.getContext(CONTEXT_DIMENSIONS) as CanvasRenderingContext2D;
  });

  it('should be created', () => {
    const colorPickerservice: ColorPickerService = TestBed.get(ColorPickerService);
    expect(colorPickerservice).toBeTruthy();
  });

  it('getPixelColorFromImage should return a new color given a pixel with getPixelColorFromImage', () => {
    // We disabled this lint rule so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(context, GET_IMAGE_DATA).and.returnValue(RGBA_ARR);
    const returnValue = service.getPixelColorFromImage(COORDINATES, context);
    expect(returnValue.getR()).toBe(R);
    expect(returnValue.getG()).toBe(G);
    expect(returnValue.getB()).toBe(B);
    expect(returnValue.getA()).toBe(A);
    expect(context.getImageData).toHaveBeenCalled();
  });

  it ('getCanvasDimensions should return the canvas dimensions with getCanvasDimensions', () => {
    const returnValue = service.getCanvasDimensions(canvas);
    expect(WIDTH_KEY in returnValue).toBeTruthy();
    expect(HEIGHT_KEY in returnValue).toBeTruthy();
  });

  it ('generatePerfectGradient should return an equally divided gradient with generatePerfectGradient', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(context, CREATE_LINEAR_GRADIENT).and.returnValue(FAKE_CANVAS_GRADIENT);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(FAKE_CANVAS_GRADIENT, ADD_COLOR_STOP);
    service.generatePerfectGradient(gradientStops, context, WIDTH, HEIGHT);
    expect(context.createLinearGradient).toHaveBeenCalled();
    expect(FAKE_CANVAS_GRADIENT.addColorStop).toHaveBeenCalledTimes(gradientStops.length);
  });

  it ('isValidNumericValue should return whether or not it is a valid numeric value with isValidNumericValue', () => {
    let returnValue = service.isValidNumericValue(FAKE_VALUE_1, MIN, MAX, false);
    expect(returnValue).toBeFalsy();

    returnValue = service.isValidNumericValue(FAKE_VALUE_2, MIN, MAX, false);
    expect(returnValue).toBeFalsy();

    returnValue = service.isValidNumericValue(FAKE_VALUE_3, MIN, MAX, false);
    expect(returnValue).toBeFalsy();

    returnValue = service.isValidNumericValue(FAKE_VALUE_4, MIN, MAX, false);
    expect(returnValue).toBeFalsy();

    returnValue = service.isValidNumericValue(FAKE_VALUE_5, MIN, MAX, false);
    expect(returnValue).toBeFalsy();

    returnValue = service.isValidNumericValue(FAKE_VALUE_4, MIN, MAX, true);
    expect(returnValue).toBeTruthy();

    returnValue = service.isValidNumericValue(FAKE_VALUE_6, MIN, MAX, false);
    expect(returnValue).toBeTruthy();
  });

  it ('isValidHexValue should return true on a valid hex value with isValidHexValue', () => {
    const returnValue = service.isValidHexValue(VALID_HEX);
    expect(returnValue).toBeTruthy();
  });

  it ('isValidHexValue should return false on an invalid hex value with isValidHexValue', () => {
    let returnValue = service.isValidHexValue(INVALID_HEX_1);
    expect(returnValue).toBeFalsy();

    returnValue = service.isValidHexValue(INVALID_HEX_2);
    expect(returnValue).toBeFalsy();
  });
});
