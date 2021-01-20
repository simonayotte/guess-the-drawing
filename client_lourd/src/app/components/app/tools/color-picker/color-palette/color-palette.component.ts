import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FailedToGet2DContextError } from '../../../../../errors/failed-to-get-two-d-context';
import { ColorPickerService } from '../../../../../services/color-picker/color-picker.service';
import { Color } from '../color';
import { BLACK_GRADIENT_STOPS, COLORS, WHITE_GRADIENT_STOPS } from '../constants';

const lineWidth = 2;
const knobRadius = 5;
const endAngle = 2 * Math.PI;
const contextDimensions = '2d';
const contextError = 'Failed to get 2D context';
const minSelectedPos = 1;
const maxSelectedPos = 249;

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss']
})
export class ColorPaletteComponent implements OnInit, AfterViewInit {
  // VARIABLES
  hue: Color;
  color: Color;
  density: Color;
  selectedPosition: { x: number; y: number };

  private paletteGradients: (CanvasGradient | string)[];
  private whiteGrad: CanvasGradient;
  private blackGrad: CanvasGradient;
  private dimensions: { width: number; height: number };
  private ctx: CanvasRenderingContext2D;
  private mousedown: boolean;

  @ViewChild('canvas', {static: true})
  palette: ElementRef<HTMLCanvasElement>;

  // METHODS
  constructor(private colorPickerService: ColorPickerService) {
    this.mousedown = false;
  }

  ngOnInit(): void {
    this.selectedPosition = {x: 0, y: 0};

    // updated from click on hue selector
    this.colorPickerService.hueClick.subscribe((result) => {
      this.hue = result;
      this.draw();
      const pixelColor = this.colorPickerService.getPixelColorFromImage(this.selectedPosition, this.ctx);
      this.colorPickerService.density.next(pixelColor);
    });

    // updated from manual color input
    this.colorPickerService.hueManual.subscribe((result) => {
      this.hue = result;
      this.draw();
    });

    // updated position from manual color input
    this.colorPickerService.color.subscribe((result) => {
      const width = this.palette.nativeElement.width;
      const height = this.palette.nativeElement.height;
      const hsv = result.getHSV();
      this.selectedPosition = {x: hsv.S * width, y: (1 - hsv.V) * height};
      this.draw();
    });
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  draw(): void {
    if (!this.ctx) {
      const context = this.palette.nativeElement.getContext(contextDimensions);
      if (!context || !(context instanceof CanvasRenderingContext2D)) {
        throw new FailedToGet2DContextError(contextError);
      }
      this.ctx = context;
      this.dimensions = this.colorPickerService.getCanvasDimensions(this.palette);
      this.whiteGrad = this.colorPickerService.generatePerfectGradient(WHITE_GRADIENT_STOPS, this.ctx, this.dimensions.width, 0);
      this.blackGrad = this.colorPickerService.generatePerfectGradient(BLACK_GRADIENT_STOPS, this.ctx, 0, this.dimensions.height);
    }

    const colorGrad = this.hue.strFormat();
    this.paletteGradients = [
      colorGrad,
      this.whiteGrad,
      this.blackGrad
    ];

    this.paletteGradients.forEach((fillStyle) => {
      this.drawGradient(fillStyle);
    });

    this.drawSelectionCircle();
    this.ctx.stroke();
  }

  drawGradient(grad: CanvasGradient | string): void {
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
  }

  drawSelectionCircle(): void {
    if (this.selectedPosition) {
      this.ctx.strokeStyle = COLORS.WHITE.strFormat();
      this.ctx.fillStyle = COLORS.WHITE.strFormat();
      this.ctx.beginPath();
      this.ctx.lineWidth = lineWidth;
      this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, knobRadius, 0, endAngle);
    }
  }

  update(): void {
    const pos = this.selectedPosition;
    this.draw();
    this.colorPickerService.density.next(this.colorPickerService.getPixelColorFromImage(pos, this.ctx));
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent): void {
    this.mousedown = false;
  }

  onMouseDown(evt: MouseEvent): void {
    this.mousedown = true;
    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
    this.correctSelectedPosition(this.selectedPosition);
    this.draw();
    this.colorPickerService.density.next(this.colorPickerService.getPixelColorFromImage(this.selectedPosition, this.ctx));
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
      this.correctSelectedPosition(this.selectedPosition);
      this.draw();
      this.colorPickerService.density.next(this.colorPickerService.getPixelColorFromImage(this.selectedPosition, this.ctx));
    }
  }

  correctSelectedPosition(selectedPosition: { x: number, y: number }): void {
    if (selectedPosition.x < minSelectedPos) {
      selectedPosition.x = minSelectedPos;
    }
    if (selectedPosition.x > maxSelectedPos) {
      selectedPosition.x = maxSelectedPos;
    }
    if (selectedPosition.y < minSelectedPos) {
      selectedPosition.y = minSelectedPos;
    }
    if (selectedPosition.y > maxSelectedPos) {
      selectedPosition.y = maxSelectedPos;
    }
  }
}
