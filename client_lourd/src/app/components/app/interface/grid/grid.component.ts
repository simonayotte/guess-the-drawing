import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DrawingSizeService } from '../../../../services/drawing/drawing-size.service';
import { GridService } from '../../../../services/grid-service/grid.service';
import { Color } from '../../tools/color-picker/color';

const D_ATTRIBUTE = 'd';
const STROKE_ATTRIBUTE = 'stroke';
const GRID_PIXELS_DEFAULT = 200;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @ViewChild('grid', {static: true})
  grid: ElementRef<SVGElement>;

  @ViewChild('pattern', {static: true})
  pattern: ElementRef<SVGPatternElement>;

  @ViewChild('path', {static: true})
  path: ElementRef<SVGPathElement>;

  gridPixels: number;

  constructor(private drawingSizeService: DrawingSizeService, private gridService: GridService) {
    this.gridPixels = GRID_PIXELS_DEFAULT;
  }

  @HostListener('window:keydown.shift.+', ['$event']) onPlus(event: KeyboardEvent): void {
    this.gridService.incrementGridPixels();
  }

  @HostListener('window:keydown.-', ['$event']) onMinus(event: KeyboardEvent): void {
    this.gridService.decrementGridPixels();
  }

  ngOnInit(): void {
    this.drawingSizeService.widthBS.subscribe((value) => {
      this.gridService.setGridWidth(this.grid.nativeElement, value);
      this.gridService.setElementWidth(this.pattern.nativeElement, this.gridPixels / value);
      this.updatePatternPath(this.gridService.getPath());
    });

    this.drawingSizeService.heightBS.subscribe((value) => {
      this.gridService.setGridHeight(this.grid.nativeElement, value);
      this.gridService.setElementHeight(this.pattern.nativeElement, this.gridPixels / value);
      this.updatePatternPath(this.gridService.getPath());
    });

    this.gridService.gridColorSubject.subscribe((value) => {
      this.updateStroke(value);
    });

    this.gridService.gridPixelsSubject.subscribe((value) => {
      this.gridPixels = value;
      this.updatePatternPath(this.gridService.getPath());
      this.gridService.updatePatternDimensions(this.pattern.nativeElement);
    });
  }

  updatePatternPath(newPath: string): void {
    this.path.nativeElement.setAttribute(D_ATTRIBUTE, newPath);
  }

  updateStroke(newColor: Color): void {
    this.path.nativeElement.setAttribute(STROKE_ATTRIBUTE, newColor.strFormat());
  }
}
