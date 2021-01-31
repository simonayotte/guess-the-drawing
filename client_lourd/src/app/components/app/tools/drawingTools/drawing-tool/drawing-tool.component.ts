import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { AbstractTool } from '../../abstract-tool';

const MAX_SIZE = 250;
const MIN_SIZE = 1;
const DEFAULT_SIZE = 25;
const ERROR_BACKGROUND = '#ff6e6e';
const DEFAULT_BACKGROUND = '#ffffff';

@Component({
  selector: 'app-drawing-tool',
  templateUrl: './drawing-tool.component.html',
  styleUrls: ['./drawing-tool.component.scss']
})
export class DrawingToolComponent extends AbstractTool {

  @Input() size: number;
  @Input() drawingTool: DrawingToolComponent;

  @ViewChild('sizeInput') sizeInput: ElementRef;
  constructor() {
    super();
    this.size = DEFAULT_SIZE;
  }

  onInput(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    const validSize: boolean = this.isValidSize(value);
    this.drawingTool.size = validSize ? value : DEFAULT_SIZE;
    this.sizeInput.nativeElement.style.backgroundColor = validSize ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
  }

  onValueChange(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    this.sizeInput.nativeElement.style.backgroundColor = DEFAULT_BACKGROUND;
    if (this.isValidSize(value)) {
      this.drawingTool.size = value;
    } else {
      this.size = DEFAULT_SIZE;
    }
  }

  isValidSize(size: number): boolean {
    return (!(isNaN(Number(size)) || size < MIN_SIZE || !(size) || size > MAX_SIZE));
  }

  onSliderChange(event: MatSliderChange): void {
    if (event.value !== null) {
      this.size = event.value;
      this.drawingTool.size = event.value;
    }
  }
}
