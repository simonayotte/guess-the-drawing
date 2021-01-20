import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { PaintBrushComponent } from 'src/app/components/app/tools/drawingTools/paint-brush/paint-brush.component';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { DrawingSizeService } from '../../drawing/drawing-size.service';
import { GallerieDrawingService } from '../../gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from '../../svg-service/svg.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';
import { PaintBrushService } from './paint-brush.service';

const DRAW_LINE = 'drawLine';
const eraserService = 'eraserService';
const ADD_PATH = 'addPath';
const LEFT_BUTTON = 1;
const TIME_CALLED_3 = 3;
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';

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

describe('PaintBrushService', () => {

  let service: PaintBrushService;
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const mockComponent = new PaintBrushComponent(new PaintBrushService(new PathDrawingService(),
                                                                      new CommandInvokerService(mockContinueDrawing),
                        new EraserService(new PathDrawingService(),
                                          new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));
  const pathDrawingService = 'pathDrawingService';
  const mockMouseEvent = new MouseEvent('mouseEvent');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Renderer2, useClass: MockRenderer2}]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PaintBrushService] });
    service = TestBed.get(PaintBrushService);
    service.renderer = TestBed.get(Renderer2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMouseUp should call drawline() and set isDrawing to false', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, DRAW_LINE);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'autoSaveDrawing');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[eraserService], ADD_PATH);
    service.isDrawing = true;

    service.onMouseUp(mockMouseEvent);
    expect(service.isDrawing).toBe(false);
    expect(service[DRAW_LINE]).toHaveBeenCalledTimes(1);
    expect(service[CONTINUE_DRAWING_SERVICE].autoSaveDrawing).toHaveBeenCalled();
  });

  it('initializerenderer should call initializeRenderer() from pathDrawingService', () => {
    spyOn(service[pathDrawingService], 'initializeRenderer');
    service.initializeRenderer(service.renderer);

    expect(service[pathDrawingService].initializeRenderer).toHaveBeenCalled();
  });

  it('onMouseEnter should call onMouseDownInElement() if the mouse left button is down', () => {
    spyOn(service, 'onMouseDownInElement');
    const mockColor = new Color(0, 0, 0, 0);
    const  mockEvent: MouseEvent = new MouseEvent('click', { buttons : LEFT_BUTTON });
    service.onMouseEnter(mockEvent, mockComponent, mockColor);

    expect(service.onMouseDownInElement).toHaveBeenCalled();
  });

  it('onMouseEnter should throw an error if the mouse left button is up', () => {
    const mockColor = new Color(0, 0, 0, 0);
    expect( () =>  {
      service.onMouseEnter(mockMouseEvent, mockComponent, mockColor);
    }).toThrowError('The drawing has not started yet');
  });

  it('onMouseMove should call drawLine()', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, DRAW_LINE);
    service.onMouseMove(mockMouseEvent);
    expect(service[DRAW_LINE]).toHaveBeenCalled();
  });

  it('onMouseDownInElement() should isDrawing to true, call setAttribute and update the pathString', () => {
    const initializeString = 'M ' + mockMouseEvent.offsetX + ' ' + mockMouseEvent.offsetY + ' ';
    const lineString =  'L ' + mockMouseEvent.offsetX + ' ' + mockMouseEvent.offsetY + ' ';
    const finalString = initializeString + lineString;
    spyOn(service.renderer, 'setAttribute');
    spyOn(service.renderer, 'createElement');
    spyOn(service[pathDrawingService], 'setBasicAttributes');
    spyOn(service[pathDrawingService], 'initializePathString').and.returnValue(initializeString);
    spyOn(service[pathDrawingService], 'lineCreatorString').and.returnValue(lineString);
    spyOn(service[pathDrawingService], 'setPathString');

    service.isDrawing = false;

    const mockColor = new Color(0, 0, 0, 0);
    service.onMouseDownInElement(mockMouseEvent, mockComponent, mockColor);

    expect(service.pathString).toBe(finalString);
    expect(service.isDrawing).toBe(true);
    expect(service.renderer.createElement).toHaveBeenCalled();
    expect(service.renderer.setAttribute).toHaveBeenCalledTimes(TIME_CALLED_3);
    expect(service[pathDrawingService].setBasicAttributes).toHaveBeenCalled();
    expect(service[pathDrawingService].initializePathString).toHaveBeenCalled();
    expect(service[pathDrawingService].lineCreatorString).toHaveBeenCalled();
    expect(service[pathDrawingService].setPathString).toHaveBeenCalled();

  });

  it('drawLine should add a line to the string of the path when isDrawing is true', () => {
    const initialString = '';
    const lineString =  'L ' + mockMouseEvent.offsetX + ' ' + mockMouseEvent.offsetY + ' ';

    spyOn(service[pathDrawingService], 'lineCreatorString').and.returnValue(lineString);
    spyOn(service[pathDrawingService], 'setPathString');

    service.pathString = initialString;
    service.isDrawing = true;
    service[DRAW_LINE](mockMouseEvent);

    expect(service.pathString).toBe(lineString);
    expect(service[pathDrawingService].lineCreatorString).toHaveBeenCalled();
    expect(service[pathDrawingService].setPathString).toHaveBeenCalled();
  });

  it('drawLine should throw an error when isDrawing is false', () => {
    service.isDrawing = false;
    expect( () =>  {
      service[DRAW_LINE](mockMouseEvent);
    }).toThrowError('The drawing has not started yet');
  });
});
