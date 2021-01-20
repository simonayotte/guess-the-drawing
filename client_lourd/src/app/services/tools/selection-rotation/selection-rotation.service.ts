import { Injectable, Renderer2 } from '@angular/core';
import { RotateCommand } from 'src/app/components/app/command/rotate-command';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { SelectedElementsService } from '../../selected-elements/selected-elements.service';
import { SelectionManipulationService } from '../selection-manipulation/selection-manipulation.service';
import { SelectionToolService } from '../selection-tool-service/selection-tool.service';

const SMALL_ROTATION = 1;
const BIG_ROTATION = 15;
const Y = 1;
const X = 0;
@Injectable({
  providedIn: 'root'
})
export class SelectionRotationService {

  private selectedElements: SVGPathElement[];
  private renderer: Renderer2;
  private altIsDown: boolean;
  private selfCenteredRotation: boolean;

  constructor(private commandInvoker: CommandInvokerService, private selectionTool: SelectionToolService,
              private selectionManipulationService: SelectionManipulationService,
              private selectedElementsService: SelectedElementsService) {
    this.selectedElementsService.selectedElements.subscribe( (selectedElements: SVGPathElement[]) => {
      this.initializeRotation(selectedElements);
    });
    this.altIsDown = false;
    this.selfCenteredRotation = false;
  }

  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
  }

  onAltDown(): void {
    this.altIsDown = true;
  }

  onAltUp(): void {
    this.altIsDown = false;
  }

  onShiftDown(): void {
    this.selfCenteredRotation = true;
  }

  onShiftUp(): void {
    this.selfCenteredRotation = false;
  }

  initializeRotation(selectedElements: SVGPathElement[]): void {
      this.selectedElements = selectedElements;
      this.initialRotate();
  }

  onMouseWheelMovement(event: WheelEvent): void {
    if (this.selectedElements.length > 0) {
      event.preventDefault();
      const currentRotation = this.currentRotationValue((event.deltaY < 0));
      if (this.selfCenteredRotation  || this.selectedElements.length === 1) {
        this.selfCenteredRotate(currentRotation);
      } else {
        this.selectionCenteredRotate(currentRotation, this.selectedElements);
      }
      this.createRotationCommand(currentRotation);
      this.selectionTool.autoSaveDrawing();
    }
  }

  private selfCenteredRotate(currentRotation: number): void {
    for (const element of this.selectedElements) {
      this.updateRotationAngle(element, currentRotation);
    }
  }

  private createRotationCommand(currentRotation: number): void {
    const command = new RotateCommand(this.selectedElements, !(this.selfCenteredRotation || this.selectedElements.length === 1),
                                      currentRotation, this.selectionManipulationService, this.selectionCenteredRotate.bind(this));
    command.initializeRenderer(this.renderer);
    this.commandInvoker.addCommand(command);
  }

  private selectionCenteredRotate(currentRotation: number, selectedElements: SVGPathElement[]): void {
    const rotationPoint = this.selectionManipulationService.getCenterPositionOfAllElements(selectedElements);
    for (const element of selectedElements) {
      const translateValue: [number, number] = this.translateValueForRotation(element, rotationPoint, currentRotation);
      const translateString = 'translate (' + translateValue[X] + ' ' +  translateValue[Y] + ') ';
      this.translateElement(element, translateString);
      this.updateRotationAngle(element, currentRotation);
    }
  }

  private translateElement(element: SVGPathElement, translateString: string): void {
    let transformString =  element.getAttribute('transform');
    if (transformString) {
      transformString = this.selectionManipulationService.deleteLastRotate(transformString);
      this.renderer.setAttribute(element, 'transform', transformString + translateString);
    } else {
      this.renderer.setAttribute(element, 'transform', translateString);
    }
  }

  private updateRotationAngle(element: SVGPathElement, currentRotation: number): void {
    const rotationAngle =  element.getAttribute('rotationAngle');
    if (!rotationAngle) {
      this.renderer.setAttribute(element, 'rotationAngle', currentRotation.toString());
    } else {
      this.renderer.setAttribute(element, 'rotationAngle', (+rotationAngle + currentRotation).toString());
    }
    this.selectionManipulationService.updateRotation(element);
  }

  private translateValueForRotation(path: SVGPathElement, centerOfRotation: [number, number], rotationAngle: number): [number, number] {
    const rotationString = 'rotate (' + rotationAngle + ',' + centerOfRotation[X] + ',' + centerOfRotation[Y] + ') ';
    const initialString = path.getAttribute('transform');
    const transformString = initialString;
    this.addRotationString(path, transformString, rotationString);
    const finalPosition = this.selectionManipulationService.getCenterPositionOfElement(path);
    this.resetTransformString(path, initialString);
    const initialPosition = this.selectionManipulationService.getCenterPositionOfElement(path);
    return [finalPosition[X] - initialPosition[X], finalPosition[Y] - initialPosition[Y]];
  }

  private addRotationString(path: SVGPathElement, transformString: string | null, rotationString: string): void {
    if (transformString) {
      transformString = rotationString + this.selectionManipulationService.deleteLastRotate(transformString);
      this.renderer.setAttribute(path, 'transform', transformString);
    } else {
      this.renderer.setAttribute(path, 'transform', rotationString);
    }
  }

  private resetTransformString(path: SVGPathElement, initialTransform: string | null): void {
    if (initialTransform) {
      this.renderer.setAttribute(path, 'transform', initialTransform);
    } else {
      this.renderer.setAttribute(path, 'transform', '');
    }
  }

  private currentRotationValue(clockWise: boolean): number {
    const currentRotation = this.altIsDown ? SMALL_ROTATION : BIG_ROTATION;
    return clockWise ? currentRotation : -currentRotation;
  }

  private initialRotate(): void {
    for (const element of this.selectedElements) {
      const rotationAngle =  element.getAttribute('rotationAngle');
      if (!rotationAngle) {
        this.renderer.setAttribute(element, 'rotationAngle', '0');
      }
    }
  }
}
