import { Injectable, Renderer2 } from '@angular/core';
import { CutCommand } from '../../components/app/command/cut-command';
import { PasteCommand } from '../../components/app/command/paste-command';
import { ContinueDrawingService } from '../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../drawing/command-invoker.service';
import { DrawingSizeService } from '../drawing/drawing-size.service';
import { SelectedElementsService } from '../selected-elements/selected-elements.service';
import { SelectionManipulationService } from '../tools/selection-manipulation/selection-manipulation.service';
import { SelectionToolService } from '../tools/selection-tool-service/selection-tool.service';

const SHIFT_DIFF = 20;
@Injectable({
  providedIn: 'root'
})
export class ClipBoardService {
  private currentSelection: SVGPathElement[];
  clipBoardContent: SVGPathElement[];
  private shiftValueOnCopy: number;
  private shiftValueOnDuplicate: number;
  private renderer: Renderer2;
  // We disabled this rule since its a callback with zero or multiple parameters which has no type
  // tslint:disable-next-line: no-any
  private deleteSelectionCallback: any;
  constructor(selectedElementService: SelectedElementsService, private commandInvoker: CommandInvokerService,
              private selectionTool: SelectionToolService, private drawingSize: DrawingSizeService,
              private selectionManipulation: SelectionManipulationService, private continueDrawingService: ContinueDrawingService) {
    this.clipBoardContent = [];
    this.currentSelection = [];
    this.shiftValueOnCopy = SHIFT_DIFF;
    this.shiftValueOnDuplicate = SHIFT_DIFF;
    selectedElementService.selectedElements.subscribe((newSelectedElem) => {
      this.currentSelection = newSelectedElem;
      this.shiftValueOnDuplicate = SHIFT_DIFF;
    });
  }
  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
  }
  // We disabled this rule since its a callback with zero or multiple parameters which has no type
  // tslint:disable-next-line: no-any
  setDeleteCallback(callback: any): void {
    this.deleteSelectionCallback = callback;
  }
  onCtrlC(): void {
    this.shiftValueOnCopy = SHIFT_DIFF;
    this.clipBoardContent = this.currentSelection;
  }
  onCtrlV(): void {
    if (this.clipBoardContent.length !== 0) {
      const pathsToCopy = this.copyPath(this.clipBoardContent);
      this.translatePaths(pathsToCopy, this.shiftValueOnCopy);
      this.commandInvoker.execute(new PasteCommand(pathsToCopy, this.shiftValueOnCopy));
      this.updateRotation(pathsToCopy);
      this.shiftValueOnCopy = this.checkShiftValue(this.shiftValueOnCopy, pathsToCopy);
      this.selectionTool.setSelectedElements(pathsToCopy);
    }
  }
  onCtrlX(): void {
    this.shiftValueOnCopy = 0;
    this.clipBoardContent = this.currentSelection;
    if (this.clipBoardContent.length !== 0) {
      this.commandInvoker.execute(new CutCommand(this.clipBoardContent));
    }
    this.deleteSelectionCallback();
    this.continueDrawingService.autoSaveDrawing();
  }
  onCtrlD(): void {
    if (this.currentSelection.length !== 0) {
      let shiftValue = this.shiftValueOnDuplicate;
      const pathsToDuplicate = this.copyPath(this.currentSelection);
      this.translatePaths(pathsToDuplicate, SHIFT_DIFF);
      this.commandInvoker.execute(new PasteCommand(pathsToDuplicate, SHIFT_DIFF));
      this.updateRotation(pathsToDuplicate);
      shiftValue = this.checkShiftValue(this.shiftValueOnDuplicate, pathsToDuplicate);
      this.selectionTool.setSelectedElements(pathsToDuplicate);
      this.shiftValueOnDuplicate =  shiftValue;
    }
  }

  onDelete(): void {
    this.commandInvoker.execute(new CutCommand(this.currentSelection));
    this.deleteSelectionCallback();
    this.continueDrawingService.autoSaveDrawing();
  }

  private copyPath(pathsToCopy: SVGPathElement[]): SVGPathElement[] {
    const paths: SVGPathElement[] = [];
    for (const path of pathsToCopy) {
      paths.push(path.cloneNode(true) as SVGPathElement);
    }
    return paths;
  }
  private translatePaths(paths: SVGPathElement[], translateValue: number): void {
    const translate = 'translate ( ' + translateValue + ' ' +  translateValue + ' ) ';
    for (const element of paths ) {
      let transformString = element.getAttribute('transform');
      if (transformString) {
        transformString = this.selectionManipulation.deleteLastRotate(transformString);
        this.renderer.setAttribute(element, 'transform', transformString + translate);
      } else {
        this.renderer.setAttribute(element, 'transform', translate);
      }
    }
  }
  private updateRotation(paths: SVGPathElement[]): void {
    for (const path of paths ) {
      this.selectionManipulation.updateRotation(path);
    }
  }
  private checkShiftValue(shift: number, paths: SVGPathElement[]): number {
    shift += SHIFT_DIFF;
    let maxX = 0;
    let maxY = 0;
    let d: string | null;
    let pointControl: string[] = [];
    for (const path of paths) {
      d = path.getAttribute('d');
      if (d !== null) {
        pointControl = d.split(' ');
        const index = pointControl.findIndex((m) => m === 'M');
        maxX = Number(pointControl[index + 1]) > maxX ? Number(pointControl[index + 1]) : maxX;
        maxY = Number(pointControl[index + 2]) > maxY ? Number(pointControl[index + 2]) : maxY;
      }
    }
    if ((maxY + shift) >= this.drawingSize.heightBS.value || (maxX + shift) >= this.drawingSize.widthBS.value) {
      return 0;
    }
    return shift;
  }
}
