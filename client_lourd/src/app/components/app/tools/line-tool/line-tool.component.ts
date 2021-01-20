import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatSliderChange } from '@angular/material';
import { LineService } from 'src/app/services/tools/line-service/line.service';
import { AbstractTool } from '../abstract-tool';
import { Color } from '../color-picker/color';

const MAX_JUNCTION_SIZE = 50;
const MAX_LINE_SIZE = 25;
const MIN_SIZE = 1;
const DEFAULT_LINE_SIZE = 5;
const DEFAULT_JUNCTION_SIZE = 10;
const ERROR_BACKGROUND = '#ff6e6e';
const DEFAULT_BACKGROUND = '#ffffff';

@Component({
  selector: 'app-line-tool',
  templateUrl: './line-tool.component.html',
  styleUrls: ['./line-tool.component.scss']
})
export class LineToolComponent extends AbstractTool {

  @Input() size: number;
  @Input() hasJunctionPoints: boolean;
  @Input() junctionDiameter: number;
  @Input() tool: LineToolComponent;

  @ViewChild('sizeInput', {static: false}) sizeInput: ElementRef;
  @ViewChild('junctionDiameterInput', {static: false}) junctionDiameterInput: ElementRef;
  constructor(private lineService: LineService) {
    super();
    this.hasJunctionPoints = false;
    this.size = DEFAULT_LINE_SIZE;
    this.junctionDiameter = DEFAULT_JUNCTION_SIZE;
    this.name = 'Ligne';
   }

   onInput(event: Event, type: string): void {
    event.stopImmediatePropagation();
    const maxSize = type === 'LineSize' ? MAX_LINE_SIZE : MAX_JUNCTION_SIZE;

    const value = +(event.target as HTMLInputElement).value;
    const validSize: boolean = this.isValidSize(value, maxSize);

    if (type === 'LineSize') {
      this.tool.size = validSize ? value : DEFAULT_LINE_SIZE;
      this.sizeInput.nativeElement.style.backgroundColor = validSize ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
    } else {
      this.tool.junctionDiameter = validSize ? value : DEFAULT_JUNCTION_SIZE;
      this.junctionDiameterInput.nativeElement.style.backgroundColor = validSize ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
    }
  }

  onValueChange(event: Event, type: string): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;

    if (type === 'LineSize') {
      this.sizeInput.nativeElement.style.backgroundColor = DEFAULT_BACKGROUND;
    } else {
      this.junctionDiameterInput.nativeElement.style.backgroundColor = DEFAULT_BACKGROUND;
    }

    const maxSize = type === 'LineSize' ? MAX_LINE_SIZE : MAX_JUNCTION_SIZE;
    if (this.isValidSize(value, maxSize)) {
      if (type === 'LineSize') {
        this.tool.size = value;
      } else {
        this.tool.junctionDiameter = value;
      }
    } else {
      if (type === 'LineSize') {
        this.size = DEFAULT_LINE_SIZE;
      } else {
        this.junctionDiameter = DEFAULT_JUNCTION_SIZE;
      }
    }
  }

   onSizeSliderChange(event: MatSliderChange): void {
    if (event.value !== null) {
      this.size = event.value;
      this.tool.size = event.value;
    }
  }

  onJunctionChange(event: MatCheckboxChange): void {
    if (event.checked !== null && this.tool !== undefined) {
      this.tool.hasJunctionPoints = !this.hasJunctionPoints;
    }
  }

  onJunctionSliderChange(event: MatSliderChange): void {
    if (event.value !== null) {
      this.junctionDiameter = event.value;
      this.tool.junctionDiameter = event.value;
    }
  }

  initializeRenderer(renderer: Renderer2): void {
    this.lineService.initializeRenderer(renderer);
  }

  isValidSize(size: number, maxSize: number): boolean {
    return (!(isNaN(Number(size)) || size < MIN_SIZE || !(size) || size > maxSize));
  }

  onMouseDownInElement(event: MouseEvent): SVGPathElement {
    return this.lineService.onMouseDownInElement();
  }

  onMouseDown(event: MouseEvent, primaryColor: Color): SVGPathElement {
    return this.lineService.onMouseDown(event, this, primaryColor);
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    return this.lineService.onMouseMove(event, this);
  }

  onDoubleClick(event: MouseEvent): SVGPathElement {
    return this.lineService.onDoubleClick(event, this);
  }

  onBackspaceDown(event: KeyboardEvent): SVGPathElement {
    return this.lineService.onBackspaceDown(event, this);
  }

  onEscapeClick(event: KeyboardEvent): SVGPathElement {
    return this.lineService.onEscapeClick(event);
  }

  onShiftDown(event: KeyboardEvent): SVGPathElement {
    return this.lineService.onShiftDown(event, this);
  }

  onShiftUp(event: KeyboardEvent): SVGPathElement {
    return this.lineService.onShiftUp(event);
  }

  onMouseEnter(event: MouseEvent): SVGPathElement {
    return this.lineService.onMouseEnter(event);
  }

  onMouseLeave(event: MouseEvent): SVGPathElement {
    return this.lineService.onMouseLeave(event);
  }

}
