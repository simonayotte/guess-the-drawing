import { Component, Renderer2 } from '@angular/core';
import { ColorApplicatorService } from 'src/app/services/tools/color-applicator/color-applicator.service';
import { AbstractTool } from '../abstract-tool';
import { Color } from '../color-picker/color';

@Component({
  selector: 'app-color-applicator',
  templateUrl: './color-applicator.component.html',
  styleUrls: ['./color-applicator.component.scss']
})
export class ColorApplicatorComponent extends AbstractTool {

  constructor(private colorApplicatorService: ColorApplicatorService) {
    super();
    this.name = 'Applicateur de couleur';
  }

  onMouseDownInElement(event: MouseEvent, primaryColor: Color, secondaryColor: Color): SVGPathElement | null {
    this.colorApplicatorService.onMouseDownInElement(event, primaryColor);
    return null;
  }

  onRightMouseDownInElement(event: MouseEvent, secondaryColor: Color): SVGPathElement | null {
    this.colorApplicatorService.onRightMouseDownInElement(event, secondaryColor);
    return null;
  }

  initializeRenderer(renderer: Renderer2): void {
    this.colorApplicatorService.initializeRenderer(renderer);
  }

}
