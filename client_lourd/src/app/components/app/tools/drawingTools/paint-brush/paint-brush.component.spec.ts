import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SelectedColorsService } from 'src/app/services/color-picker/selected-colors.service';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { DrawingSizeService } from 'src/app/services/drawing/drawing-size.service';
import { GallerieDrawingService } from 'src/app/services/gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from 'src/app/services/svg-service/svg.service';
import { PaintBrushService } from 'src/app/services/tools/paintbrush-service/paint-brush.service';
import { PathDrawingService } from 'src/app/services/tools/path-drawing/path-drawing.service';
import { CommandInvokerService } from '../../../../../services/drawing/command-invoker.service';
import { EraserService } from '../../../../../services/tools/eraser-service/eraser.service';
import { Color } from '../../color-picker/color';
import { PaintBrushComponent } from './paint-brush.component';

const PAINT_BRUSH_SERVICE = 'paintBrushService';

describe('PaintBrushComponent', () => {
  let component: PaintBrushComponent;
  let fixture: ComponentFixture<PaintBrushComponent>;
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const paintBrush = new PaintBrushComponent(new PaintBrushService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing),
    new EraserService(new PathDrawingService(), new CommandInvokerService(mockContinueDrawing), mockContinueDrawing), mockContinueDrawing));
  const path: SVGPathElement = {} as SVGPathElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.tool = paintBrush;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //  onTextureChange()
  it('onTextureChange should affect texture to tool.texture', () => {
    component.texture = component.textures[1];
    paintBrush.texture = component.textures[0];

    component.onTextureChange();
    expect(paintBrush.texture).toBe(component.texture);
  });

  // onMouseDownInElement
  it('onMouseDownInElement should call onMouseDownInElement of paintBrushService', () => {
    const mockMouseDownInElement = new MouseEvent('mousedown');
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(component[PAINT_BRUSH_SERVICE], 'onMouseDownInElement').and.returnValue(path);

    component.onMouseDownInElement(mockMouseDownInElement, mockColor);
    expect(component[PAINT_BRUSH_SERVICE].onMouseDownInElement).toHaveBeenCalled();
  });

  // onMouseUp
  it('onMouseUp should call onMouseUp of paintBrushService', () => {
    const mockMouseUp = new MouseEvent('mouseup');
    spyOn(component[PAINT_BRUSH_SERVICE], 'onMouseUp').and.returnValue(path);

    component.onMouseUp(mockMouseUp);
    expect(component[PAINT_BRUSH_SERVICE].onMouseUp).toHaveBeenCalled();
  });

  // onMouseMove
  it('onMouseMove should call onMouseMove of paintBrushService', () => {
    const mockMouseMove = new MouseEvent('mousemove');
    spyOn(component[PAINT_BRUSH_SERVICE], 'onMouseMove').and.returnValue(path);

    component.onMouseMove(mockMouseMove);
    expect(component[PAINT_BRUSH_SERVICE].onMouseMove).toHaveBeenCalled();
  });

  // onMouseLeave
  it('onMouseLeave should call onMouseUp of paintBrushService', () => {
    const mockMouseLeave = new MouseEvent('mouseleave');
    spyOn(component[PAINT_BRUSH_SERVICE], 'onMouseUp').and.returnValue(path);

    component.onMouseLeave(mockMouseLeave);
    expect(component[PAINT_BRUSH_SERVICE].onMouseUp).toHaveBeenCalled();
  });

  // onMouseEnter
  it('onMouseEnter should call onMouseEnter of paintBrushService', () => {
    const mockMouseEnter = new MouseEvent('mouseenter');
    const mockColor = new Color(0, 0, 0, 0);
    spyOn(component[PAINT_BRUSH_SERVICE], 'onMouseEnter').and.returnValue(path);

    component.onMouseEnter(mockMouseEnter, mockColor);
    expect(component[PAINT_BRUSH_SERVICE].onMouseEnter).toHaveBeenCalled();
  });
});
