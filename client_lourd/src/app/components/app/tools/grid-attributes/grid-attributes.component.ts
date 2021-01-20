import { Component } from '@angular/core';
import {
  DEFAULT_GRID_PIXELS,
  GRID_PIXELS_MIN, GRID_PIXELS_STEP,
  GridService,
  MAX_TRANSPARENCY,
  MIN_TRANSPARENCY,
} from '../../../../services/grid-service/grid.service';
import { AbstractTool } from '../abstract-tool';

@Component({
  selector: 'app-grid-attributes',
  templateUrl: './grid-attributes.component.html',
  styleUrls: ['./grid-attributes.component.scss']
})
export class GridAttributesComponent extends AbstractTool {
  maxTransparency: number;
  minTransparency: number;
  transparency: number;

  maxGridPixelSize: number;
  minGridPixelSize: number;
  gridPixelStep: number;
  gridPixelSize: number;

  checked: boolean;

  constructor(private gridService: GridService) {
    super();
    this.name = 'Grille';
    this.maxTransparency = MAX_TRANSPARENCY;
    this.minTransparency = MIN_TRANSPARENCY;
    this.transparency = MAX_TRANSPARENCY;

    this.minGridPixelSize = GRID_PIXELS_MIN;
    this.gridPixelStep = GRID_PIXELS_STEP;
    this.gridPixelSize = DEFAULT_GRID_PIXELS;

    this.gridService.gridPixelsSubject.subscribe((val) => {
      this.gridPixelSize = val;
    });

    this.gridService.gridColorSubject.subscribe((val) => {
      this.transparency = val.getA();
    });

    this.gridService.gridPixelsMaxSubject.subscribe((val) => {
      this.maxGridPixelSize = val;
    });

    this.gridService.gridActivationSubject.subscribe((val) => {
      this.checked = val;
    });
  }

  updateTransparency(val: number): void {
    this.gridService.setTransparency(val);
  }

  updateGridPixelSize(val: number): void {
    this.gridService.setGridPixelSize(val);
  }

  updateActivation(val: boolean): void {
    this.gridService.setActivation(val);
  }
}
