import { Component, Renderer2 } from '@angular/core';
import { SelectionRotationService } from 'src/app/services/tools/selection-rotation/selection-rotation.service';
import { SelectionToolService } from 'src/app/services/tools/selection-tool-service/selection-tool.service';
import { ClipBoardService } from '../../../../services/clipboard/clip-board.service';
import { SelectedElementsService } from '../../../../services/selected-elements/selected-elements.service';
import { AbstractTool } from '../abstract-tool';
import { Color } from '../color-picker/color';

@Component({
  selector: 'app-selection-tool',
  templateUrl: './selection-tool.component.html',
  styleUrls: ['./selection-tool.component.scss']
})
export class SelectionToolComponent extends AbstractTool {

  constructor(private selectionService: SelectionToolService, private selectionRotationService: SelectionRotationService,
              private clipBoardService: ClipBoardService, public selectedElementsService: SelectedElementsService) {
    super();
    this.name = 'Outil de Sélection';
   }

  initializeRenderer(renderer: Renderer2): void {
    this.selectionService.initializeRenderer(renderer);
    this.selectionRotationService.initializeRenderer(renderer);
  }

  onRightClickDown(event: MouseEvent): SVGPathElement {
    return this.selectionService.onRightClickDown(event);
  }

  onMouseWheel(event: WheelEvent): void {
    this.selectionRotationService.onMouseWheelMovement(event);
  }

  onMouseDownInElement(event: MouseEvent, primaryColor: Color): SVGPathElement {
    return this.selectionService.onMouseDownInElement(event);
  }

  onMouseUp(event: MouseEvent): SVGPathElement {
    return this.selectionService.onMouseUp(event);
  }

  onAltDown(): void {
    this.selectionRotationService.onAltDown();
  }

  onAltUp(): void {
    this.selectionRotationService.onAltUp();
  }

  onShiftDown(): SVGPathElement | null {
    this.selectionRotationService.onShiftDown();
    return null;
  }

  onShiftUp(): SVGPathElement | null {
    this.selectionRotationService.onShiftUp();
    return null;
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    return this.selectionService.onMouseMove(event);
  }

  onMouseLeave(event: MouseEvent): SVGPathElement {
    return this.selectionService.onMouseLeave(event);
  }

  onMouseEnter(event: MouseEvent): SVGPathElement {
    return this.selectionService.onMouseEnter(event);
  }

  selectAll(): SVGPathElement {
    return this.selectionService.selectAllElements();
  }

  onArrowsChange(arrowsDown: Map<string, boolean>, event: KeyboardEvent): void {
    this.selectionService.onArrowsChange(arrowsDown, event);
  }

  clearSelection(): void {
    this.selectionService.clearSelection();
  }
  onCtrlC(): void {
    this.clipBoardService.onCtrlC();
  }
  onCtrlV(): void {
    this.clipBoardService.onCtrlV();
  }
  onCtrlX(): void {
    this.clipBoardService.onCtrlX();
  }
  onCtrlD(): void {
    this.clipBoardService.onCtrlD();
  }
  onDelete(): void {
    this.clipBoardService.onDelete();
  }
}
