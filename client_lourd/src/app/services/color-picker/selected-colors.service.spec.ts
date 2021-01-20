import { TestBed } from '@angular/core/testing';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { SelectedColorsService } from './selected-colors.service';

const newColorSelected = 'newColorSelected';
const ifShouldAddNewColor = 'ifShouldAddNewColor';
const setColor = 'setColor';
const PRIMARY_COLOR = 0;
const SECONDARY_COLOR = 1;
const BACKGROUND_COLOR = 2;
const BACKGROUND_COLOR_NOT_CLOSE = 3;

describe('SelectedColorsService', () => {

  let service = new SelectedColorsService();

  beforeEach(() => {
    service = new SelectedColorsService();
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setColor should set primaryColorBS', () => {
    const NEW_COLOR = new Color(0, 0, 0, 1);
    service.selectColorChangeBS.next(PRIMARY_COLOR);

    service.setColor(NEW_COLOR);

    expect(service.primaryColorBS.value).toEqual(NEW_COLOR);
  });

  it('setColor should set secondaryColorBS', () => {
    const NEW_COLOR = new Color(0, 0, 0, 1);
    service.selectColorChangeBS.next(SECONDARY_COLOR);

    service.setColor(NEW_COLOR);

    expect(service.secondaryColorBS.value).toEqual(NEW_COLOR);
  });

  it('setColor should set backgroundColorBS', () => {
    const NEW_COLOR = new Color(0, 0, 0, 1);
    service.selectColorChangeBS.next(BACKGROUND_COLOR);

    service.setColor(NEW_COLOR);

    expect(service.backgroundColorBS.value).toEqual(NEW_COLOR);
  });

  it('setColor should set backgroundColorBS', () => {
    const NEW_COLOR = new Color(0, 0, 0, 1);
    service.selectColorChangeBS.next(BACKGROUND_COLOR_NOT_CLOSE);

    service.setColor(NEW_COLOR);

    expect(service.backgroundColorBS.value).toEqual(NEW_COLOR);
  });

  it('setColor should set backgroundColorBS', () => {
    const NEW_COLOR = new Color(0, 0, 0, 1);
    service.selectColorChangeBS.next(BACKGROUND_COLOR_NOT_CLOSE);

    service.setColor(NEW_COLOR);

    expect(service.backgroundColorBS.value).toEqual(NEW_COLOR);
  });

  it('ifShouldAddNewColor should call newColorSelected', () => {
    const COLOR = new Color(0, 0, 0, 1);

    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'newColorSelected');
    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'ifShouldAddNewColor').and.returnValue(true);

    service.setColor(COLOR);

    expect(service[newColorSelected]).toHaveBeenCalledTimes(1);
  });

  it('ifShouldAddNewColor should not call newColorSelected', () => {
    const COLOR = new Color(0, 0, 0, 1);

    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'newColorSelected');
    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'ifShouldAddNewColor').and.returnValue(false);

    service.setColor(COLOR);

    expect(service[newColorSelected]).toHaveBeenCalledTimes(0);
  });

  it('ifShouldAddNewColor should return false', () => {
    const MAX_LOOP_ITERATION = 9;
    const ODD_COLOR = new Color(0, 0, 0, 1);
    service.colorSelected[MAX_LOOP_ITERATION] = ODD_COLOR;

    const returnValue = service[ifShouldAddNewColor](ODD_COLOR);

    expect(returnValue).toBe(false);
  });

  it('reUseColor should call setColor()', () => {
    const mockEvent = new MouseEvent('mousedown');
    Object.defineProperty(mockEvent, 'button', {value: 0});
    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'setColor');
    service.reUseColor(0, mockEvent);
    expect(service[setColor]).toHaveBeenCalled();
  });
  it('reUseColor should call setColor()', () => {
    const mockEvent = new MouseEvent('mousedown');
    Object.defineProperty(mockEvent, 'button', {value: 2});
    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'setColor');
    service.reUseColor(0, mockEvent);
    expect(service[setColor]).toHaveBeenCalled();
  });
  it('reUseColor should call setColor()', () => {
    const mockEvent = new MouseEvent('mousedown');
    Object.defineProperty(mockEvent, 'button', {value: 2});
    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'setColor');
    service.reUseColor(0, mockEvent);
    expect(service[setColor]).toHaveBeenCalled();
  });
  it('reUseColor should call setColor()', () => {
    const mockEvent = new MouseEvent('mousedown');
    Object.defineProperty(mockEvent, 'button', {value: 3});
    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'setColor');
    service.reUseColor(0, mockEvent);
    expect(service[setColor]).toHaveBeenCalled();
  });
  it ('newColorSelected should call pop() on colorSelected if the color is not included in the array', () => {
    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'ifShouldAddNewColor').and.returnValue(true);
    spyOn(service.colorSelected, 'pop');

    service[newColorSelected](new Color(0, 0, 0, 0));

    expect(service.colorSelected.pop).toHaveBeenCalled();

  });

  it ('newColorSelected should call splice() on colorSelected if the color is included in the array', () => {
    // tslint:disable-next-line: no-any --> To be able to test private fonction
    spyOn<any>(service, 'ifShouldAddNewColor').and.returnValue(false);
    spyOn(service.colorSelected, 'splice');

    service[newColorSelected](new Color(0, 0, 0, 0));

    expect(service.colorSelected.splice).toHaveBeenCalled();
  });

  it ('newColorSelected should call unshift(), next() and changeDrawingColor()', () => {
    spyOn(service.colorSelected, 'unshift');
    spyOn(service.colorSelectedBS, 'next');
    service[newColorSelected](new Color(0, 0, 0, 0));
    expect(service.colorSelected.unshift).toHaveBeenCalled();
    expect(service.colorSelectedBS.next).toHaveBeenCalled();
  });

});
