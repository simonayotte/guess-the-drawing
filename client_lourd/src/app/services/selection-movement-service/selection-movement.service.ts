import { Injectable, Renderer2 } from '@angular/core';
import { TranslateCommand } from 'src/app/components/app/command/translate-command';
import { CommandInvokerService } from '../drawing/command-invoker.service';
import { EraserService } from '../tools/eraser-service/eraser.service';
import { SelectionManipulationService } from '../tools/selection-manipulation/selection-manipulation.service';

const X = 0;
const Y = 1;
const INTERVAL = 0;
const TIMEOUT = 1;
const UP_ARROW = 'ArrowUp';
const LEFT_ARROW = 'ArrowLeft';
const RIGHT_ARROW = 'ArrowRight';
const DOWN_ARROW = 'ArrowDown';
const TRANSLATE_VALUE = 3;
const CONTINUOUS_TRANSLATE_INTERVAL = 100;
const START_DELAY = 500;

@Injectable({
  providedIn: 'root'
})
export class SelectionMovementService {

  private startingPosition: [number, number];
  private selectedElements: SVGPathElement[];
  private renderer: Renderer2;
  private movementStarted: boolean;
  private currentTranslate: [number, number];
  private intervals: number[];
  private selectedArrows: Map<string, boolean>;
  private selectionBoxCallBack: () => void;

  constructor(private commandInvoker: CommandInvokerService, private eraserService: EraserService,
              private selectionManipulation: SelectionManipulationService) {
    this.selectedElements = [];
    this.intervals = [0, 0];
  }

  initalizeSelectionBoxCallBack(callback: () => void): void {
    this.selectionBoxCallBack = callback;
  }

  initializeMovement(event: MouseEvent, selectedElements: SVGPathElement[]): void {
    this.startingPosition = [event.offsetX, event.offsetY];
    this.initializeElements(selectedElements);
  }

  onMouseMove(event: MouseEvent): void {
    this.currentTranslate = [event.offsetX - this.startingPosition[X], event.offsetY - this.startingPosition[Y]];
    this.translateAllElements();
  }

  private firstArrowTranslate(): void {
    this.arrowsTranslate();
    this.intervals[TIMEOUT] = window.setTimeout(() => {
      if (!this.allArrowsAreUp()) {
        this.initializeContinuousTranslate();
      } else {
        this.movementStarted = false;
      }
    }, START_DELAY);
  }

  private initializeContinuousTranslate(): void {
    this.intervals[INTERVAL] = window.setInterval( () => {
      this.arrowsTranslate();
    }, CONTINUOUS_TRANSLATE_INTERVAL);
  }

  private arrowsTranslate(): void {
    let translateX = 0;
    let translateY = 0;
    translateX -= this.selectedArrows.get(LEFT_ARROW) ? TRANSLATE_VALUE : 0;
    translateX += this.selectedArrows.get(RIGHT_ARROW) ? TRANSLATE_VALUE : 0;
    translateY -= this.selectedArrows.get(UP_ARROW) ? TRANSLATE_VALUE : 0;
    translateY += this.selectedArrows.get(DOWN_ARROW) ? TRANSLATE_VALUE : 0;
    this.currentTranslate = [this.currentTranslate[X] + translateX, this.currentTranslate[Y] + translateY];
    this.translateAllElements();
  }

  onArrowsChange(arrowsDown: Map<string, boolean>, selectedElements: SVGPathElement[]): void {
    this.selectedArrows = arrowsDown;
    if (this.movementStarted && this.allArrowsAreUp()) {
      clearInterval(this.intervals[INTERVAL]);
      clearTimeout(this.intervals[TIMEOUT]);
      this.onMouseUp();
      this.movementStarted = false;
    } else if (!this.movementStarted) {
      this.initializeElements(selectedElements);
      this.movementStarted = true;
      this.firstArrowTranslate();
    }
    this.selectionBoxCallBack();
  }

  onMouseUp(): void {
    if (this.currentTranslate[X] !== 0 || this.currentTranslate[Y] !== 0) {
      const command = new TranslateCommand(this.selectedElements,
        'translate ( ' + this.currentTranslate[X] + ' ' +  this.currentTranslate[Y] + ' ) ', this.currentTranslate,
        this.selectionManipulation);
      command.initializeRenderer(this.renderer);
      this.commandInvoker.addCommand(command);
      this.eraserService.refreshTransform(this.selectedElements, this.currentTranslate);
    }
  }

  private initializeElements(selectedElements: SVGPathElement[]): void {
    this.selectedElements = selectedElements;
    this.currentTranslate = [0, 0];
    this.initialTranslate();
  }

  private allArrowsAreUp(): boolean {
    return !(this.selectedArrows.get(LEFT_ARROW) || this.selectedArrows.get(RIGHT_ARROW) ||
             this.selectedArrows.get(UP_ARROW) || this.selectedArrows.get(DOWN_ARROW));
  }

  private translateAllElements(): void {
    const translate = 'translate ( ' + this.currentTranslate[X] + ' ' +  this.currentTranslate[Y] + ' ) ';
    for (const element of this.selectedElements) {
      this.translateElement(element, translate);
    }
    this.selectionBoxCallBack();
  }

  translateElement(element: SVGPathElement, translateString: string): void {
    let transformString =  element.getAttribute('transform');
    if (transformString) {
      transformString = transformString.substring(0, transformString.lastIndexOf('translate'));
      transformString = this.selectionManipulation.deleteLastRotate(transformString);
      this.renderer.setAttribute(element, 'transform', transformString + translateString);
      this.selectionManipulation.updateRotation(element);
    } else {
      this.renderer.setAttribute(element, 'transform', translateString);
    }
  }

  private initialTranslate(): void {
    const translate = 'translate( 0 0 ) ';
    for (const element of this.selectedElements) {
      const transformString =  element.getAttribute('transform');
      if (transformString) {
        this.renderer.setAttribute(element, 'transform', transformString + translate);
        this.selectionManipulation.updateRotation(element);
      } else {
        this.renderer.setAttribute(element, 'transform', translate);
      }
    }
  }
  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
    this.selectionManipulation.initializeRenderer(renderer);
  }
}
