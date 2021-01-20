import { Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
import { PolygoneService } from 'src/app/services/tools/polygone-service/polygone.service';
import { Color } from '../../../color-picker/color';
import { ShapeToolComponent } from '../../shape-tool/shape-tool.component';

const DEFAULT_SIDES = 7;
const MAX_SIZE = 12;
const MIN_SIZE = 3;
const ERROR_BACKGROUND = '#ff6e6e';
const DEFAULT_BACKGROUND = '#ffffff';

@Component({
  selector: 'app-polygone',
  templateUrl: './polygone.component.html',
  styleUrls: ['./polygone.component.css']
})
export class PolygoneComponent extends ShapeToolComponent {

  @Input() tool: PolygoneComponent;
  @Input() numberSides: number;
  @ViewChild('numberSidesInput', {static: false}) sidesInput: ElementRef;

  constructor(private polygoneService: PolygoneService) {
    super();
    this.name = 'Polygone';
    this.numberSides = DEFAULT_SIDES;
  }

  onInput(event: Event): void {
    event.stopImmediatePropagation();
    this.tool.numberSides = DEFAULT_SIDES;
    const value = +(event.target as HTMLInputElement).value;
    const validSides: boolean  = this.isValidSides(value);
    this.tool.numberSides = validSides ? value : DEFAULT_SIDES;
    this.sidesInput.nativeElement.style.backgroundColor = validSides ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
  }

  onValueChange(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    this.sidesInput.nativeElement.style.backgroundColor = DEFAULT_BACKGROUND;
    if (this.isValidSize(value)) {
      this.tool.numberSides = value;
    } else {
      this.numberSides = DEFAULT_SIDES;
    }
  }

  isValidSides(sides: number): boolean {
    return (!(isNaN(Number(sides)) || sides < MIN_SIZE || !(sides) || sides > MAX_SIZE));
  }

  initializeRenderer(renderer: Renderer2): void {
    this.polygoneService.initializeRenderer(renderer);
  }

  onMouseDownInElement(event: MouseEvent, primaryColor: Color, secondaryColor: Color): SVGPathElement {
    return this.polygoneService.onMouseDownInElement();
  }

  onMouseDown(event: MouseEvent, primaryColor: Color, secondaryColor: Color): SVGPathElement {
    return this.polygoneService.onMouseDown(event, this, primaryColor, secondaryColor);
  }

  onMouseUp(event: MouseEvent): SVGPathElement {
    return this.polygoneService.onMouseUp();
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    return this.polygoneService.onMouseMove(event, this.numberSides);
  }

  onMouseLeave(event: MouseEvent): SVGPathElement {
    return this.polygoneService.onMouseLeave();
  }

  onMouseEnter(event: MouseEvent): SVGPathElement {
    return this.polygoneService.onMouseEnter();
  }
}
