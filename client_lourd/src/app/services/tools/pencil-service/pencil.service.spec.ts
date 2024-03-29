import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { PencilComponent } from 'src/app/components/app/tools/drawingTools/pencil/pencil.component';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';
import { PencilService } from './pencil.service';
import { OtherClientDrawingManager } from '../../clientPathListener/other-client-drawing-manager'
const DRAW_LINE = 'drawLine';
const LEFT_BUTTON = 1;
const eraserService = 'eraserService';
const ADD_PATH = 'addPath';

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

describe('PencilService', () => {

  let service: PencilService;
  const mockOtherClientManager = {}
  const mockComponent = new PencilComponent(new PencilService(new PathDrawingService(), new CommandInvokerService(),
  new EraserService(new PathDrawingService(), new CommandInvokerService(), mockOtherClientManager as OtherClientDrawingManager),mockOtherClientManager as OtherClientDrawingManager, new SelectedColorsService()));

  const pathDrawingService = 'pathDrawingService';
  const mockMouseEvent = new MouseEvent('mouseEvent');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: Renderer2, useClass: MockRenderer2}]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PencilService] });
    service = TestBed.get(PencilService);
    service.renderer = TestBed.get(Renderer2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMouseUp should call drawline() and set isDrawing to false', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, DRAW_LINE);
    service.isDrawing = true;
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[eraserService], ADD_PATH);
    service.onMouseUp(mockMouseEvent);
    expect(service.isDrawing).toBe(false);
    expect(service[DRAW_LINE]).toHaveBeenCalledTimes(1);
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from pathDrawingService', () => {
    spyOn(service[pathDrawingService], 'initializeRenderer');
    service.initializeRenderer(service.renderer);

    expect(service[pathDrawingService].initializeRenderer).toHaveBeenCalled();
  });

  it('onMouseEnter should call onMouseDownInElement() if the mouse left button is down', () => {
    spyOn(service, 'onMouseDownInElement');
    const  mockEvent: MouseEvent = new MouseEvent('click', { buttons : LEFT_BUTTON });
    service.onMouseEnter(mockEvent, mockComponent);

    expect(service.onMouseDownInElement).toHaveBeenCalled();
  });

  it('onMouseEnter should throw an error if the mouse left button is up', () => {
    expect( () =>  {
      service.onMouseEnter(mockMouseEvent, mockComponent);
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

    service.onMouseDownInElement(mockMouseEvent, mockComponent);

    expect(service.pathString).toBe(finalString);
    expect(service.isDrawing).toBe(true);
    expect(service.renderer.createElement).toHaveBeenCalled();
    expect(service.renderer.setAttribute).toHaveBeenCalledTimes(2);
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
