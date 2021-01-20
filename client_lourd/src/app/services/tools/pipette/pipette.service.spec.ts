import { async, TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { PipetteService } from './pipette.service';

const POSTION_R = 0;
const POSTION_G = 1;
const POSTION_B = 2;
const POSTION_A = 3;
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';

export default class Canvas {

  getImageData(): ImageData {
    const returnImageData =  new ImageData(1, 1);
    returnImageData.data[POSTION_R] = 0;
    returnImageData.data[POSTION_G] = 0;
    returnImageData.data[POSTION_B] = 0;
    returnImageData.data[POSTION_A] = 0;

    return returnImageData;
  }
}

// tslint:disable-next-line: max-classes-per-file
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

const pathDrawingService = 'pathDrawingService';
const renderer = 'renderer';
const selectedColors = 'selectedColors';
const graphicsManager = 'graphicsManager';

describe('PipetteService', () => {
  let service: PipetteService;
  const mockMouseEvent = new MouseEvent('mouseEvent');

  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PipetteService]});
    service = TestBed.get(PipetteService);
    service[renderer] = TestBed.get(Renderer2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from pathDrawingService', () => {
    spyOn(service[pathDrawingService], 'initializeRenderer');
    service.initializeRenderer(service[renderer]);

    expect(service[pathDrawingService].initializeRenderer).toHaveBeenCalled();
  });

  // leftClick
  it('leftClick should call svgToCanvas', () => {
    spyOn(service[graphicsManager], 'svgToCanvas');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    const mockCanvas = jasmine.createSpyObj('canvas', ['getContext']);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[renderer], 'createElement').and.returnValue(mockCanvas);

    service.leftClick(mockMouseEvent);

    expect(service[graphicsManager].svgToCanvas).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  // rightClick
  it('rightClick should call svgToCanvas', () => {
    spyOn(service[graphicsManager], 'svgToCanvas');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    const mockCanvas = jasmine.createSpyObj('canvas', ['getContext']);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[renderer], 'createElement').and.returnValue(mockCanvas);

    service.rightClick(mockMouseEvent);

    expect(service[graphicsManager].svgToCanvas).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  // setPrimaryColor
  it('setPrimaryColor should call no function', () => {
    spyOn(service[selectedColors].primaryColorBS, 'next');

    service.setPrimaryColor(null as unknown as CanvasRenderingContext2D, service[selectedColors], mockMouseEvent);

    expect(service[selectedColors].primaryColorBS.next).toHaveBeenCalledTimes(0);

  });

  it('setPrimaryColor should call no function', () => {
    spyOn(service[selectedColors].primaryColorBS, 'next');

    service.setPrimaryColor(new Canvas() as unknown as CanvasRenderingContext2D, service[selectedColors], mockMouseEvent);

    expect(service[selectedColors].primaryColorBS.next).toHaveBeenCalledTimes(1);

  });

  // setSecondaryColor
  it('setSecondaryColor should call no function', () => {
    spyOn(service[selectedColors].secondaryColorBS, 'next');

    service.setSecondaryColor(null as unknown as CanvasRenderingContext2D, service[selectedColors], mockMouseEvent);

    expect(service[selectedColors].secondaryColorBS.next).toHaveBeenCalledTimes(0);

  });

  it('setSecondaryColor should call no function', () => {
    spyOn(service[selectedColors].secondaryColorBS, 'next');

    service.setSecondaryColor(new Canvas() as unknown as CanvasRenderingContext2D, service[selectedColors], mockMouseEvent);

    expect(service[selectedColors].secondaryColorBS.next).toHaveBeenCalledTimes(1);

  });

});
