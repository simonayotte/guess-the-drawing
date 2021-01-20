import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { PaintBucketService } from 'src/app/services/tools/paint-bucket/paint-bucket.service';
import { AbstractTool } from '../abstract-tool';

const PAINT_BUCKET = 'Sceau de peinture';
const MAX_TOLERANCE = 100;
const MIN_TOLERANCE = 0;
const DEFAULT_TOLERANCE = 10;
const ERROR_BACKGROUND = '#ff6e6e';
const DEFAULT_BACKGROUND = '#ffffff';

@Component({
  selector: 'app-paint-bucket',
  templateUrl: './paint-bucket.component.html',
  styleUrls: ['./paint-bucket.component.scss']
})
export class PaintBucketComponent extends AbstractTool {

  @Input() tolerance: number;
  @Input() tool: PaintBucketComponent;

  @ViewChild('toleranceInput', {static: false}) toleranceInput: ElementRef;
  constructor(private paintBucketService: PaintBucketService) {
    super();
    this.name = PAINT_BUCKET;
    this.tolerance = DEFAULT_TOLERANCE;
   }

  initializeRenderer(renderer: Renderer2): void {
    this.paintBucketService.initializeRenderer(renderer);
  }

  onMouseDownInElement(event: MouseEvent): SVGPathElement {
    return this.paintBucketService.onMouseDownInElement(event, this.tolerance);
  }

  onInput(event: Event): void {
    event.stopImmediatePropagation();

    const value = +((event.target as HTMLInputElement).value);
    const validSize: boolean = this.isValidSize(value, MAX_TOLERANCE, MIN_TOLERANCE);

    this.tool.tolerance = validSize ? value : DEFAULT_TOLERANCE;
    this.toleranceInput.nativeElement.style.backgroundColor = validSize ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
  }

  isValidSize(size: number, maxSize: number, minSize: number): boolean {
    return (!(isNaN(Number(size)) || size < minSize || !(size) || size > maxSize));
  }

  onValueChange(event: Event): void {
    event.stopImmediatePropagation();
    const value = +((event.target as HTMLInputElement).value);

    this.toleranceInput.nativeElement.style.backgroundColor = DEFAULT_BACKGROUND;

    if (this.isValidSize(value, MAX_TOLERANCE, MIN_TOLERANCE)) {
      this.tool.tolerance = value;
    } else {
      this.tolerance = DEFAULT_TOLERANCE;
    }
  }

  onToleranceSliderChange(event: MatSliderChange): void {
    if (event.value !== null) {
      this.tolerance = event.value;
      this.tool.tolerance = event.value;
    }
  }
}
