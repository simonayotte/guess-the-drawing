import { Injectable, Renderer2 } from '@angular/core';
import { Callback } from 'src/app/components/app/callback-factory/callback';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { GraphicsManager } from 'src/app/components/app/tools/graphics/graphics-manager';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { SvgService } from '../../svg-service/svg.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';

const POSTION_R = 0;
const POSTION_G = 1;
const POSTION_B = 2;
const POSTION_A = 3;
const MAX_VALUE = 255;

@Injectable({
  providedIn: 'root'
})
export class PipetteService {

  private renderer: Renderer2;
  private graphicsManager: GraphicsManager = new GraphicsManager();

  constructor(private pathDrawingService: PathDrawingService, private svgService: SvgService,
              private selectedColors: SelectedColorsService, private continueDrawingService: ContinueDrawingService) {
  }

  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
    this.pathDrawingService.initializeRenderer(renderer);
  }

  leftClick(event: MouseEvent): void {
    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
    const callback = new Callback(this.setPrimaryColor, canvas.getContext('2d'), this.selectedColors, event);
    this.graphicsManager.svgToCanvas(this.svgService.svgSubject.getValue(), canvas, true, callback);
    this.continueDrawingService.autoSaveDrawing();
  }

  rightClick(event: MouseEvent): void {
    const canvas: HTMLCanvasElement = this.renderer.createElement('canvas');
    const callback = new Callback(this.setSecondaryColor, canvas.getContext('2d'), this.selectedColors, event);
    this.graphicsManager.svgToCanvas(this.svgService.svgSubject.getValue(), canvas, true, callback);
    this.continueDrawingService.autoSaveDrawing();
  }

  setPrimaryColor(ctx: CanvasRenderingContext2D, selectedColors: SelectedColorsService, event: MouseEvent): void {
    if (ctx !== null) {
      const imageColor = ctx.getImageData(event.offsetX, event.offsetY, 1 , 1);
      const primaryColor = new Color(imageColor.data[POSTION_R], imageColor.data[POSTION_G],
        imageColor.data[POSTION_B], imageColor.data[POSTION_A] / MAX_VALUE);
      selectedColors.selectColorChangeBS.next(0);
      selectedColors.setColor(primaryColor);
    }
  }

  setSecondaryColor(ctx: CanvasRenderingContext2D , selectedColors: SelectedColorsService, event: MouseEvent): void {
    if (ctx !== null) {
      const imageColor = ctx.getImageData(event.offsetX, event.offsetY, 1 , 1);
      const secondaryColor = new Color(imageColor.data[POSTION_R], imageColor.data[POSTION_G],
        imageColor.data[POSTION_B], imageColor.data[POSTION_A] / MAX_VALUE);
      selectedColors.selectColorChangeBS.next(1);
      selectedColors.setColor(secondaryColor);
    }
  }

}
