import { Component, Renderer2 } from '@angular/core';
import { PipetteService } from 'src/app/services/tools/pipette/pipette.service';
import { AbstractTool } from '../abstract-tool';

const PIPETTE = 'Pipette';

@Component({
  selector: 'app-pipette',
  templateUrl: './pipette.component.html',
  styleUrls: ['./pipette.component.scss']
})
export class PipetteComponent extends AbstractTool {

  constructor(private pipetteService: PipetteService) {
    super();
    this.name = PIPETTE;
  }

  initializeRenderer(renderer: Renderer2): void {
    this.pipetteService.initializeRenderer(renderer);
  }

  onMouseDownInElement(event: MouseEvent): null {
    this.pipetteService.leftClick(event);
    return null;
  }

  onRightMouseDownInElement(event: MouseEvent): null {
    this.pipetteService.rightClick(event);
    return null;
  }

}
