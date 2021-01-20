import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { AerosolService } from 'src/app/services/tools/aerosol-service/aerosol.service';
import { AbstractTool } from '../../abstract-tool';
import { Color } from '../../color-picker/color';

const MAX_DIAMETER = 25;
const MIN_DIAMETER = 1;
const MAX_SPEED = 500;
const MIN_SPEED = 10;
const DEFAULT_DIAMETER = 5;
const DEFAULT_EMISSION = 200;
const ERROR_BACKGROUND = '#ff6e6e';
const DEFAULT_BACKGROUND = '#ffffff';
const DIAMETER = 'Diameter';

@Component({
  selector: 'app-aerosol',
  templateUrl: './aerosol.component.html',
  styleUrls: ['./aerosol.component.scss']
})
export class AerosolComponent extends AbstractTool {

  @Input() diameter: number;
  @Input() emissionPerSecond: number;
  @Input() tool: AerosolComponent;

  @ViewChild('diameterInput', {static: false}) diameterInput: ElementRef;
  @ViewChild('emissionSpeedInput', {static: false}) emissionSpeedInput: ElementRef;

  constructor(private aerosolService: AerosolService) {
    super();
    this.name = 'Aérosol';
    this.diameter = DEFAULT_DIAMETER;
    this.emissionPerSecond = DEFAULT_EMISSION;
   }

   onMouseDownInElement(event: MouseEvent, primaryColor: Color, secondaryColor: Color): SVGPathElement {
     return this.aerosolService.onMouseDownInElement(event, primaryColor, this);
   }

   onMouseMove(event: MouseEvent): SVGPathElement {
     return this.aerosolService.onMouseMove(event);
   }

   onMouseUp(event: MouseEvent): SVGPathElement {
     return this.aerosolService.onMouseUp();
   }

   onInput(event: Event, type: string): void {
    event.stopImmediatePropagation();
    const maxSize = type === DIAMETER ? MAX_DIAMETER : MAX_SPEED;
    const minSize = type === DIAMETER ? MIN_DIAMETER : MIN_SPEED;

    const value = +((event.target as HTMLInputElement).value);
    const validSize: boolean = this.isValidSize(value, maxSize, minSize);

    if (type === DIAMETER) {
      this.tool.diameter = validSize ? value : DEFAULT_DIAMETER;
      this.diameterInput.nativeElement.style.backgroundColor = validSize ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
    } else {
      this.tool.emissionPerSecond = validSize ? value : DEFAULT_EMISSION;
      this.emissionSpeedInput.nativeElement.style.backgroundColor = validSize ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
    }
  }

  isValidSize(size: number, maxSize: number, minSize: number): boolean {
    return (!(isNaN(Number(size)) || size < minSize || !(size) || size > maxSize));
  }

  onValueChange(event: Event, type: string): void {
    event.stopImmediatePropagation();
    const value = +((event.target as HTMLInputElement).value);

    if (type === DIAMETER) {
      this.diameterInput.nativeElement.style.backgroundColor = DEFAULT_BACKGROUND;
    } else {
      this.emissionSpeedInput.nativeElement.style.backgroundColor = DEFAULT_BACKGROUND;
    }

    const maxSize = type === DIAMETER ? MAX_DIAMETER : MAX_SPEED;
    const minSize = type === DIAMETER ? MIN_DIAMETER : MIN_SPEED;
    if (this.isValidSize(value, maxSize, minSize)) {
      if (type === DIAMETER) {
        this.tool.diameter = value;
      } else {
        this.tool.emissionPerSecond = value;
      }
    } else {
      if (type === DIAMETER) {
        this.diameter = DEFAULT_DIAMETER;
      } else {
        this.emissionPerSecond = DEFAULT_EMISSION;
      }
    }
  }

  onDiameterSliderChange(event: MatSliderChange): void {
    if (event.value !== null) {
      this.diameter = event.value;
      this.tool.diameter = event.value;
    }
  }

  onEmissionSpeedSliderChange(event: MatSliderChange): void {
    if (event.value !== null) {
      this.emissionPerSecond = event.value;
      this.tool.emissionPerSecond = event.value;
    }
  }

  initializeRenderer(renderer: Renderer2): void {
    this.aerosolService.initializeRenderer(renderer);
  }

}
