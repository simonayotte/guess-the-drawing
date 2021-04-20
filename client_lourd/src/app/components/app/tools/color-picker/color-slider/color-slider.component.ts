import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FailedToGet2DContextError } from '../../../../../errors/failed-to-get-two-d-context';
import { ColorPickerService } from '../../../../../services/color-picker/color-picker.service';
import { Color } from '../color';
import { KNOB_HEIGHT, KNOB_POSITION, RAINBOW_GRADIENT_STOPS } from '../constants';

// min and max values for the knob to be shown
const minHeightPercent = 0.0001;
const maxHeightPercent = 0.9999;
const lineWidth = 1.3;
const half = 2;
const contextDimensions = '2d';
const contextError = 'Failed to get 2D context';
const stroke = 'white';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements OnInit, AfterViewInit {
  private ctx: CanvasRenderingContext2D;
  private mouseDown: boolean;
  private selectedHeight: number;
  private dimensions: { width: number, height: number };

  hue: Color;

  @ViewChild('slider', { static: true })
  slider: ElementRef<HTMLCanvasElement>;

  constructor(private colorPickerService: ColorPickerService) {
    this.mouseDown = false;
  }

  ngOnInit(): void {
    this.colorPickerService.color.subscribe((result) => {
      if (this.ctx) {
        this.valueChangeRefresh(result);
      }
    });
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  //
  // DRAWING
  //
  draw(): void {
    // get the canvas element
    if (!this.ctx) {
      const context = this.slider.nativeElement.getContext(contextDimensions);
      if (!context || !(context instanceof CanvasRenderingContext2D)) {
        throw new FailedToGet2DContextError(contextError);
      }
      this.ctx = context;
      // get the canvas dimensions
      this.dimensions = this.colorPickerService.getCanvasDimensions(this.slider);
    }
    // draw the gradient on the canvas and the knob
    this.drawColorSlider(this.dimensions);
    this.drawKnob(this.dimensions.height);
  }

  drawColorSlider(dimensions: { width: number, height: number }): void {
    const gradient = this.colorPickerService.generatePerfectGradient(RAINBOW_GRADIENT_STOPS, this.ctx, dimensions.width, dimensions.height);
    this.ctx.beginPath();
    this.ctx.rect(0, 0, dimensions.width, dimensions.height);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawKnob(diameter: number): void {
    if (this.selectedHeight) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = stroke;
      this.ctx.lineWidth = lineWidth;
      this.ctx.rect(KNOB_POSITION, this.selectedHeight - KNOB_HEIGHT / half, diameter, KNOB_HEIGHT);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.clickRefresh(event);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent): void {
    this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      this.clickRefresh(event);
    }
  }

  clickRefresh(event: MouseEvent): void {
    this.setHeight(event.offsetY);
    const coordinates = { x: this.dimensions.width / 2, y: event.offsetY };
    const color = this.colorPickerService.getPixelColorFromImage(coordinates, this.ctx);
    this.refresh(event, color);
  }

  valueChangeRefresh(color: Color): void {
    const hue = color.getHue();
    const newHeightPercentage = hue / Color.MAX_HUE;
    this.setHeight(newHeightPercentage * this.dimensions.height);

    this.draw();
    const totalWidth = this.slider.nativeElement.width;
    const pixelColor = this.colorPickerService.getPixelColorFromImage({x: totalWidth / half, y: this.selectedHeight}, this.ctx);
    this.colorPickerService.hueManual.next(pixelColor);
  }

  refresh(event: MouseEvent, color: Color): void {
    this.draw();
    this.colorPickerService.hueClick.next(color);
  }

  setHeight(height: number): void {
    this.selectedHeight = height;
    if (this.selectedHeight > maxHeightPercent * this.dimensions.height) {
      this.selectedHeight = maxHeightPercent * this.dimensions.height;
    } else if (this.selectedHeight < minHeightPercent * this.dimensions.height) {
      this.selectedHeight = minHeightPercent * this.dimensions.height;
    }
  }
}
