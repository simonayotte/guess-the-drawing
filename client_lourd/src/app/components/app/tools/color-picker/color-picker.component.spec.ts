import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from '../../../../app-routing.module';
import { AppModule } from '../../../../app.module';
import { MaterialModule } from '../../../../material/material.module';
import { Color } from './color';
import { ColorPickerComponent } from './color-picker.component';

const COLOR_PICKER_SERVICE = 'colorPickerService';
const IS_VALID_NUMERIC_VALUE = 'isValidNumericValue';
const IS_VALID_HEX_VALUE = 'isValidHexValue';
const VALIDATE_COLOR = 'validateColor';
const SET_RGB_FROM_HEX = 'setRGBFromHex';
const VALIDATE_ALPHA = 'validateAlpha';
const VALIDATE_HEX = 'validateHex';
const VALIDATE_INPUT = 'validateInput';
const REFRESH_ALL_INPUTS = 'refreshAllInputs';
const NEXT_FUNCTION = 'next';
const VALUE_STRING = 'a value';
const SET_R = 'setR';
const SET_G = 'setG';
const SET_B = 'setB';
const SET_A = 'setA';
const GET_R = 'getR';
const GET_G = 'getG';
const GET_B = 'getB';
const STR_HEX = 'strFormatHex';
const R_ATTRIBUTE = 'r';
const G_ATTRIBUTE = 'g';
const B_ATTRIBUTE = 'b';
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ngOnInit()
  it('should intantiate color if undefined', () => {
    component.color = null as unknown as Color;
    const fakeColor = new Color(Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_ALPHA);
    component[COLOR_PICKER_SERVICE].density.next(fakeColor);
    expect(component.color).toBe(fakeColor);
  });

  // changeColor
  it ('should call next() from colorPickerService on r change with changeColor', () => {
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component.color, SET_R);
    spyOn(component, VALIDATE_COLOR);

    component.isValid = true;
    component.changeColor(Color.MAX_COLOR.toString(), R_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalled();
    expect(component.color.setR).toHaveBeenCalled();
    expect(component.validateColor).toHaveBeenCalled();
  });

  it ('changeColor should not call setR if isValidG is false', () => {
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component.color, SET_R);
    spyOn(component, VALIDATE_COLOR);

    component.isValid = false;
    component.isValidR = false;
    component.changeColor(VALUE_STRING, R_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalledTimes(0);
    expect(component.color.setR).toHaveBeenCalledTimes(0);
    expect(component.validateColor).toHaveBeenCalled();
  });

  it ('should call next() from colorPickerService on g change with changeColor', () => {
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component.color, SET_G);
    spyOn(component, VALIDATE_COLOR);

    component.isValid = true;
    component.changeColor(Color.MAX_COLOR.toString(), G_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalled();
    expect(component.color.setG).toHaveBeenCalled();
    expect(component.validateColor).toHaveBeenCalled();
  });

  it ('changeColor should not call setG if isValidG is false', () => {
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component.color, SET_G);
    spyOn(component, VALIDATE_COLOR);

    component.isValid = false;
    component.isValidG = false;
    component.changeColor(VALUE_STRING, G_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalledTimes(0);
    expect(component.color.setG).toHaveBeenCalledTimes(0);
    expect(component.validateColor).toHaveBeenCalled();
  });

  it ('should call next() from colorPickerService on b change with changeColor', () => {
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component.color, SET_B);
    spyOn(component, VALIDATE_COLOR);

    component.isValid = true;
    component.changeColor(Color.MAX_COLOR.toString(), B_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalled();
    expect(component.color.setB).toHaveBeenCalled();
    expect(component.validateColor).toHaveBeenCalled();
  });

  it ('should not call next() from colorPickerService on an invalid value with changeColor', () => {
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component.color, SET_B);
    spyOn(component, VALIDATE_COLOR);

    component.isValid = false;
    component.isValidB = true;
    component.changeColor(Color.MAX_COLOR.toString(), B_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalledTimes(0);
    expect(component.color.setB).toHaveBeenCalledTimes(1);
    expect(component.validateColor).toHaveBeenCalled();
  });

  it ('changeColor should not call setB if isValidB is false', () => {
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component.color, SET_B);
    spyOn(component, VALIDATE_COLOR);

    component.isValid = false;
    component.isValidB = false;
    component.changeColor(VALUE_STRING, B_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalledTimes(0);
    expect(component.color.setB).toHaveBeenCalledTimes(0);
    expect(component.validateColor).toHaveBeenCalled();
  });

  // changeAlpha
  it ('should call next() from colorPickerService on a change with changeAlpha', () => {
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component.color, SET_A);
    spyOn(component, VALIDATE_ALPHA);

    component.isValid = true;
    component.changeAlpha(Color.MAX_ALPHA.toString());

    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalled();
    expect(component.color.setA).toHaveBeenCalled();
    expect(component.validateAlpha).toHaveBeenCalled();
  });

  it ('should not call next() from colorPickerService on an invalid value with changeAlpha', () => {
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component.color, SET_A);
    spyOn(component, VALIDATE_ALPHA);
    spyOn(component, REFRESH_ALL_INPUTS);

    component.isValidA = false;
    component.changeAlpha(Color.MAX_COLOR.toString());

    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalledTimes(0);
    expect(component.color.setA).toHaveBeenCalledTimes(0);
    expect(component.refreshAllInputs).toHaveBeenCalledTimes(0);
    expect(component.validateAlpha).toHaveBeenCalled();
  });

  // changeHex()
  it('changeHex should call setRGBFromHex and change colorPickerService color', () => {
    spyOn(component.color, SET_RGB_FROM_HEX);
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component, VALIDATE_HEX);

    component.isValid = true;
    component.changeHex(VALUE_STRING);

    expect(component.color.setRGBFromHex).toHaveBeenCalled();
    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalled();
    expect(component.validateHex).toHaveBeenCalled();
  });

  it('changeHex should not call setRGBFromHex and not change colorPickerService color', () => {
    spyOn(component.color, SET_RGB_FROM_HEX);
    spyOn(component[COLOR_PICKER_SERVICE].color, NEXT_FUNCTION);
    spyOn(component, VALIDATE_HEX);
    spyOn(component, REFRESH_ALL_INPUTS);

    component.isValidHex = false;
    component.changeHex(VALUE_STRING);

    expect(component.color.setRGBFromHex).toHaveBeenCalledTimes(0);
    expect(component[COLOR_PICKER_SERVICE].color.next).toHaveBeenCalledTimes(0);
    expect(component.refreshAllInputs).toHaveBeenCalledTimes(0);
    expect(component.validateHex).toHaveBeenCalled();
  });

  // selectedvalue()
  it('selectedValue should call newColorSelected and if changeBackgroundColor is false, call closeAll', () => {
    const BACKGROUND_COLOR_NOT_CLOSE = 3;
    const PRIMARY_COLOR = 0;

    component.selectedColorsService.selectColorChangeBS.next(BACKGROUND_COLOR_NOT_CLOSE);
    spyOn(component.selectedColorsService, 'setColor');
    spyOn(component[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    spyOn(component[CONTINUE_DRAWING_SERVICE], 'isDrawingInLocalStorage').and.returnValue(true);

    component.selectedValue();

    expect(component.selectedColorsService.setColor).toHaveBeenCalled();
    expect(component[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
    expect(component[CONTINUE_DRAWING_SERVICE].isDrawingInLocalStorage).toHaveBeenCalled();

    component.selectedColorsService.selectColorChangeBS.next(PRIMARY_COLOR);

    component.selectedValue();
  });

  it('selectedValue should call newColorSelected and if changeBackgroundColor is false, call closeAll', () => {
    const BACKGROUND_COLOR_NOT_CLOSE = 3;

    component.selectedColorsService.selectColorChangeBS.next(BACKGROUND_COLOR_NOT_CLOSE);
    spyOn(component.selectedColorsService, 'setColor');
    spyOn(component[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    spyOn(component[CONTINUE_DRAWING_SERVICE], 'isDrawingInLocalStorage').and.returnValue(false);

    component.selectedValue();

    expect(component.selectedColorsService.setColor).toHaveBeenCalled();
    expect(component[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalledTimes(0);
    expect(component[CONTINUE_DRAWING_SERVICE].isDrawingInLocalStorage).toHaveBeenCalled();
  });

  // validateColor()
  it ('should set isValidR to isValid value with validateColor', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_NUMERIC_VALUE).and.returnValue(true);

    component.isValidHex = false;
    component.validateColor(VALUE_STRING, R_ATTRIBUTE);

    expect(component.isValidR).toBe(component.isValid);
    expect(component[COLOR_PICKER_SERVICE].isValidNumericValue).toHaveBeenCalled();
  });

  it ('validateColor should leave isValidHex true if it is already true on R_ATTRIBUTE', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_NUMERIC_VALUE).and.returnValue(false);

    component.isValidHex = true;
    component.validateColor(VALUE_STRING, R_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].isValidNumericValue).toHaveBeenCalled();
  });

  it ('validateColor should leave isValidHex true if it is already true on G_ATTRIBUTE', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_NUMERIC_VALUE).and.returnValue(false);

    component.isValidHex = true;
    component.validateColor(VALUE_STRING, G_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].isValidNumericValue).toHaveBeenCalled();
  });

  it ('validateColor should leave isValidHex true if it is already true on B_ATTRIBUTE', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_NUMERIC_VALUE).and.returnValue(false);

    component.isValidHex = true;
    component.validateColor(VALUE_STRING, B_ATTRIBUTE);

    expect(component[COLOR_PICKER_SERVICE].isValidNumericValue).toHaveBeenCalled();
  });

  it ('should set isValidG to isValid value with validateColor', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_NUMERIC_VALUE).and.returnValue(true);

    component.isValidHex = false;
    component.validateColor(VALUE_STRING, G_ATTRIBUTE);

    expect(component.isValidG).toBe(component.isValid);
    expect(component[COLOR_PICKER_SERVICE].isValidNumericValue).toHaveBeenCalled();
  });

  it ('should set isValidB to true with a valid value with validateColor', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_NUMERIC_VALUE).and.returnValue(true);

    component.isValidHex = false;
    component.validateColor(VALUE_STRING, B_ATTRIBUTE);

    expect(component.isValidB).toBe(component.isValid);
    expect(component[COLOR_PICKER_SERVICE].isValidNumericValue).toHaveBeenCalled();
  });

  it ('should set isValidA to isValid value with validateColor', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_NUMERIC_VALUE);

    component.isValid = true;
    component.validateAlpha(VALUE_STRING);

    expect(component.isValidA).toBe(component.isValid);
    expect(component[COLOR_PICKER_SERVICE].isValidNumericValue).toHaveBeenCalled();
  });

  it ('should set isValidR to isValid value with validateColor', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_NUMERIC_VALUE).and.returnValue(true);

    component.isValid = true;
    component.isValidA = true;
    component.isValidB = true;
    component.isValidR = true;
    component.isValidG = true;
    component.validateColor(VALUE_STRING, R_ATTRIBUTE);

    expect(component.isValid).toBeTruthy();
  });

  it ('should set isValidHex to false with an invalid value with validateHex', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_HEX_VALUE).and.returnValue(false);
    spyOn(component, VALIDATE_INPUT);

    component.isValidR = false;
    component.isValidG = false;
    component.isValidB = false;
    component.validateHex(VALUE_STRING);

    expect(component.isValidHex).toBeFalsy();
    expect(component.isValidR).toBeFalsy();
    expect(component.isValidG).toBeFalsy();
    expect(component.isValidB).toBeFalsy();
    expect(component[COLOR_PICKER_SERVICE].isValidHexValue).toHaveBeenCalled();
    expect(component.validateInput).toHaveBeenCalled();
  });

  it ('should set isValidHex if valid is true, set isValidR, isValidG and isValidB to true', () => {
    spyOn(component[COLOR_PICKER_SERVICE], IS_VALID_HEX_VALUE).and.returnValue(true);
    spyOn(component, VALIDATE_INPUT);

    component.validateHex(VALUE_STRING);

    expect(component.isValidR).toBeTruthy();
    expect(component.isValidG).toBeTruthy();
    expect(component.isValidB).toBeTruthy();
    expect(component.validateInput).toHaveBeenCalled();
  });

  it('should set value if inputs are valid with refreshAllInputs', () => {
    component.color = new Color(Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_ALPHA);
    spyOn(component.color, GET_R).and.returnValue(Color.MAX_COLOR);
    spyOn(component.color, GET_G).and.returnValue(Color.MAX_COLOR);
    spyOn(component.color, GET_B).and.returnValue(Color.MAX_COLOR);
    spyOn(component.color, STR_HEX);

    component.isValidR = true;
    component.isValidG = true;
    component.isValidB = true;
    component.isValidHex = true;

    component.refreshAllInputs(component.color);

    expect(component.color.getR).toHaveBeenCalled();
    expect(component.color.getG).toHaveBeenCalled();
    expect(component.color.getB).toHaveBeenCalled();
    expect(component.color.strFormatHex).toHaveBeenCalled();
  });

  it('should not set value if inputs are invalid with refreshAllInputs', () => {
    spyOn(component.color, GET_R);
    spyOn(component.color, GET_G);
    spyOn(component.color, GET_B);
    spyOn(component.color, STR_HEX);

    component.isValidR = false;
    component.isValidG = false;
    component.isValidB = false;
    component.isValidHex = false;

    component.refreshAllInputs(component.color);

    expect(component.color.getR).toHaveBeenCalledTimes(0);
    expect(component.color.getG).toHaveBeenCalledTimes(0);
    expect(component.color.getB).toHaveBeenCalledTimes(0);
    expect(component.color.strFormatHex).toHaveBeenCalledTimes(0);
  });

  it('validateInput should set isValid true if isValidHex and isValidA are true', () => {
    component.isValidHex = true;
    component.isValidA = true;

    component.validateInput();

    expect(component.isValid).toBeTruthy();
  });

  it('validateInput should set isValid true if isValid (R G and B) and isValidA are true', () => {
    component.isValidR = true;
    component.isValidG = true;
    component.isValidB = true;
    component.isValidA = true;

    component.validateInput();

    expect(component.isValid).toBeTruthy();
  });

  it('validateInput should set isValid false if isValid (R G and B) and isValidHex are false', () => {
    component.isValidR = false;
    component.isValidG = false;
    component.isValidB = false;
    component.isValidHex = false;
    component.isValidA = true;

    component.validateInput();

    expect(component.isValid).toBeFalsy();
  });
// We disabled this rule since this is a test file and the number of lines isnt important
// tslint:disable-next-line: max-file-line-count
});
