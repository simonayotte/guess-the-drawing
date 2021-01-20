import { Injectable } from '@angular/core';
import { SvgManager } from 'src/app/components/app/tools/graphics/svg-manager';
import { SelectedColorsService } from '../color-picker/selected-colors.service';
import { DrawingSizeService } from '../drawing/drawing-size.service';
import { GallerieDrawingService } from '../gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgStringManipulationService } from '../gallerie-services/svgStringManipulation/svg-string-manipulation.service';
import { SvgService } from '../svg-service/svg.service';

@Injectable({
  providedIn: 'root'
})
export class ContinueDrawingService {

  private svgElement: SVGElement;

  constructor(private gallerieDrawingService: GallerieDrawingService, private drawingSizeService: DrawingSizeService,
              private selectedColorsService: SelectedColorsService, private svgService: SvgService,
              ) {
    this.svgService.svgSubject.subscribe((svg) => {
      this.svgElement = svg;
    });
  }

  autoSaveDrawing(): void {
    localStorage.setItem('drawing', SvgManager.getString(this.svgElement));
  }

  open(): void {
    const drawing = (this.isDrawingInLocalStorage()) ? localStorage.getItem('drawing') as string : '';
    this.gallerieDrawingService.setValuesWithSvgString(drawing);
    this.drawingSizeService.updateHeight(SvgStringManipulationService.getHeight(drawing));
    this.drawingSizeService.updateWidth(SvgStringManipulationService.getWidth(drawing));
    if (this.isDrawingInLocalStorage()) {
      this.selectedColorsService.backgroundColorBS.next(SvgStringManipulationService.getBackGroundColor(drawing));
    } else {
      this.selectedColorsService.backgroundColorBS.next(this.selectedColorsService.backgroundColorBS.value);
    }
  }

  clear(): void {
    localStorage.clear();
  }

  isDrawingInLocalStorage(): boolean {
    return (localStorage.length === 0) ? false : true;
  }
}
