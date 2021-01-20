import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { EraserService } from '../../../../services/tools/eraser-service/eraser.service';
import { AbstractTool } from '../abstract-tool';
const MAX_SIZE = 250;
const MIN_SIZE = 3;

const ERROR_BACKGROUND = '#ff6e6e';
const DEFAULT_BACKGROUND = '#ffffff';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss']
})
export class EraserComponent extends AbstractTool {
  @Input() size: number;
  @ViewChild('sizeInput', {static: false}) sizeInput: ElementRef;

  constructor(private eraserService: EraserService) {
    super();
    this.name = 'Efface';
    this.size = this.eraserService.eraserSize.value;
  }

  initializeRenderer(renderer: Renderer2): void {
    this.eraserService.initializeRenderer(renderer);
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    return this.eraserService.onMouseMove(event);
  }
  onMouseDownInElement(event: MouseEvent): SVGPathElement {
    return this.eraserService.onMouseDownInElement(event);
  }
  onMouseUp(event: MouseEvent): SVGPathElement {
    return this.eraserService.onMouseUp(event);
  }
  onMouseLeave(event: MouseEvent): SVGPathElement {
    return this.eraserService.onMouseLeave(event);
  }
  onMouseEnter(event: MouseEvent): SVGPathElement {
    return this.eraserService.onMouseEnter(event);
  }
  onInput(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    const validSize: boolean = this.isValidSize(value);
    if (validSize) {
      this.eraserService.eraserSize.next(value);
      this.size = this.eraserService.eraserSize.value;
    }
    this.sizeInput.nativeElement.style.backgroundColor = validSize ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
  }
  onValueChange(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    this.sizeInput.nativeElement.style.backgroundColor = DEFAULT_BACKGROUND;
    if (this.isValidSize(value)) {
      this.eraserService.eraserSize.next(value);
    } else {
      this.size = MIN_SIZE;
    }
    this.size = this.eraserService.eraserSize.value;
  }
  onSliderChange(event: MatSliderChange): void {
    if (event.value !== null) {
      this.size = event.value;
      this.eraserService.eraserSize.next(event.value);
      this.size = this.eraserService.eraserSize.value;
    }
  }
  private isValidSize(size: number): boolean {
    return (!(isNaN(Number(size)) || size < MIN_SIZE || !(size) || size > MAX_SIZE));
  }
}
