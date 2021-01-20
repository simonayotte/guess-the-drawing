/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { SvgManager } from 'src/app/components/app/tools/graphics/svg-manager';
import { SvgStringManipulationService } from '../gallerie-services/svgStringManipulation/svg-string-manipulation.service';
import { ContinueDrawingService } from './continue-drawing.service';

const gallerieDrawingService = 'gallerieDrawingService';
const setValuesWithSvgString = 'setValuesWithSvgString';
const drawingSizeService = 'drawingSizeService';
const updateHeight = 'updateHeight';
const updateWidth = 'updateWidth';
const getHeight = 'getHeight';
const getWidth = 'getWidth';
const getBackGroundColor = 'getBackGroundColor';
const selectedColorsService =  'selectedColorsService';
const next = 'next';

describe('Service: ContinueDrawing', () => {
  let service: ContinueDrawingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContinueDrawingService]
    });
    service = TestBed.get(ContinueDrawingService);
  });

  it('should ...', inject([ContinueDrawingService], () => {
    expect(service).toBeTruthy();
  }));

  it('autoSaveDrawing should call setItem() of localStorage with the svg', inject([ContinueDrawingService], () => {
    spyOn(localStorage, 'setItem');
    spyOn(SvgManager, 'getString');
    service.autoSaveDrawing();
    expect(localStorage.setItem).toHaveBeenCalled();
  }));

  it('clear should call clear() of localStorage', inject([ContinueDrawingService], () => {
    spyOn(localStorage, 'clear');
    service.clear();
    expect(localStorage.clear).toHaveBeenCalled();
  }));

  it('open should call all it s fonction', () => {
    const isdrawingInLocalStorgeSpy = spyOn(service, 'isDrawingInLocalStorage').and.returnValue(true);
    spyOn(service[gallerieDrawingService], setValuesWithSvgString);
    spyOn(service[drawingSizeService], updateHeight);
    spyOn(service[drawingSizeService], updateWidth);
    spyOn(SvgStringManipulationService, getHeight);
    spyOn(SvgStringManipulationService, getWidth);
    spyOn(SvgStringManipulationService, getBackGroundColor);
    spyOn(service[selectedColorsService].backgroundColorBS, next);

    service.open();

    expect(service[gallerieDrawingService].setValuesWithSvgString).toHaveBeenCalled();
    expect(service[drawingSizeService].updateHeight).toHaveBeenCalled();
    expect(service[drawingSizeService].updateWidth).toHaveBeenCalled();
    expect(SvgStringManipulationService.getHeight).toHaveBeenCalled();
    expect(SvgStringManipulationService.getWidth).toHaveBeenCalled();
    expect(service[selectedColorsService].backgroundColorBS.next).toHaveBeenCalled();
    expect(SvgStringManipulationService.getBackGroundColor).toHaveBeenCalled();

    isdrawingInLocalStorgeSpy.and.returnValue(false);
    service.open();
    expect(service[selectedColorsService].backgroundColorBS.next).toHaveBeenCalled();

  });
});
