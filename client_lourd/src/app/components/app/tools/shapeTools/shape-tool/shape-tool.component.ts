import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { AbstractTool } from '../../abstract-tool';

const MAX_SIZE = 50;
const MIN_SIZE = 1;
const DEFAULT_SIZE = 5;
const ERROR_BACKGROUND = '#ff6e6e';
const DEFAULT_BACKGROUND = '#ffffff';

@Component({
  selector: 'app-shape-tool',
  templateUrl: './shape-tool.component.html',
  styleUrls: ['./shape-tool.component.scss']
})
export class ShapeToolComponent extends AbstractTool {

  @Input() lineSize: number;
  @Input() shapeTool: ShapeToolComponent;
  @Input() shapeType: string;
  @ViewChild('lineSizeInput', {static: false}) sizeInput: ElementRef;

  shapeTypeArray: string[] = [
    'Contour',
    'Plein',
    'Plein avec contour'
  ];

  constructor() {
    super();
    this.name = 'Outil de forme';
    this.lineSize = DEFAULT_SIZE;
    this.shapeType = this.shapeTypeArray[0];
  }

  onInput(event: Event): void {
    event.stopImmediatePropagation();
    this.shapeTool.lineSize = DEFAULT_SIZE;
    const value = +(event.target as HTMLInputElement).value;
    const validSize: boolean  = this.isValidSize(value);
    this.shapeTool.lineSize = validSize ? value : DEFAULT_SIZE;
    this.sizeInput.nativeElement.style.backgroundColor = validSize ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
  }

  onValueChange(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    this.sizeInput.nativeElement.style.backgroundColor = DEFAULT_BACKGROUND;
    if (this.isValidSize(value)) {
      this.shapeTool.lineSize = value;
    } else {
      this.lineSize = DEFAULT_SIZE;
    }
  }

  onLineSizeChange(event: MatSliderChange): void {
    if (event.value !== null) {
      this.lineSize = event.value;
      this.shapeTool.lineSize = event.value;
    }
  }

  onTypeChange(event: MatRadioChange): void {
    this.shapeTool.shapeType = event.value;
  }

  isValidSize(size: number): boolean {
    return (!(isNaN(Number(size)) || size < MIN_SIZE || !(size) || size > MAX_SIZE));
  }

}
