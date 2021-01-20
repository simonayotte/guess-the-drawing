import { Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedColorsService } from 'src/app/services/color-picker/selected-colors.service';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { DrawingSizeService } from 'src/app/services/drawing/drawing-size.service';
import { GallerieDrawingService } from 'src/app/services/gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from 'src/app/services/svg-service/svg.service';
import { PathDrawingService } from 'src/app/services/tools/path-drawing/path-drawing.service';
import { PipetteService } from 'src/app/services/tools/pipette/pipette.service';
import { PipetteComponent } from './pipette.component';

const PIPETTE_SERVICE = 'pipetteService';

describe('PipetteComponent', () => {
  let renderer: Renderer2;
  let component: PipetteComponent;
  let fixture: ComponentFixture<PipetteComponent>;
  const mockMouseEvent = new MouseEvent('mouseEvent');
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());
  const mockPipette = new PipetteService(
    new PathDrawingService(), new SvgService(), new SelectedColorsService(), mockContinueDrawing);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component[PIPETTE_SERVICE] = mockPipette;
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // initializeRenderer(Renderer2)
  it('initializerenderer should call initializeRenderer() from lineService', () => {
    spyOn(component[PIPETTE_SERVICE], 'initializeRenderer');

    component.initializeRenderer(renderer);
    expect(component[PIPETTE_SERVICE].initializeRenderer).toHaveBeenCalled();

  });

  // onMouseDownInElement
  it('should call leftClick fonction from pipette service', () => {
    spyOn(component[PIPETTE_SERVICE], 'leftClick');

    component.onMouseDownInElement(mockMouseEvent);

    expect(component[PIPETTE_SERVICE].leftClick).toHaveBeenCalled();
  });

  // onRightMouseDownInElement
  it('should call rightClick fonction from pipette service', () => {
    spyOn(component[PIPETTE_SERVICE], 'rightClick');

    component.onRightMouseDownInElement(mockMouseEvent);

    expect(component[PIPETTE_SERVICE].rightClick).toHaveBeenCalled();
  });

});
