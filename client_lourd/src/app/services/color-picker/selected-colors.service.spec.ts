import { TestBed } from '@angular/core/testing';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { SelectedColorsService } from './selected-colors.service';

const newColorSelected = 'newColorSelected';
const setColor = 'setColor';

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

    service.setColor(NEW_COLOR);

    expect(service.primaryColorBS.value).toEqual(NEW_COLOR);
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
