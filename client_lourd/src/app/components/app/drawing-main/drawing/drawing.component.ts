import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { GallerieDrawingService } from 'src/app/services/gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { ClipBoardService } from '../../../../services/clipboard/clip-board.service';
import { SelectedColorsService } from '../../../../services/color-picker/selected-colors.service';
import { DialogDismissService } from '../../../../services/Dialog/dialog-dismiss.service';
import { CommandInvokerService } from '../../../../services/drawing/command-invoker.service';
import { CurrentDrawingDataService } from '../../../../services/drawing/current-drawing-data.service';
import { DrawingSizeService } from '../../../../services/drawing/drawing-size.service';
import { GridService } from '../../../../services/grid-service/grid.service';
import { SelectedToolService } from '../../../../services/selected-tool/selected-tool.service';
import { SvgService } from '../../../../services/svg-service/svg.service';
import { EraserService } from '../../../../services/tools/eraser-service/eraser.service';
import { AbstractTool } from '../../tools/abstract-tool';
import { Color } from '../../tools/color-picker/color';
import { SvgManager } from '../../tools/graphics/svg-manager';
import { SelectionToolComponent } from '../../tools/selection-tool/selection-tool.component';

const LEFT_BUTTON = 0;
const NUMBER_CHILD_NOT_TO_DELETE = 5;
const SELECTION_TOOL = 'Outil de Sélection';
const PIPETTE = 'pipette';
const TOOL_BAR_WIDTH = 120;
const TYPES_OF_ELEMENT = ['path', 'g', 'svg'];

@Component({
  selector: './drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent implements AfterViewInit, OnInit {
  @ViewChild('Eraser', {static: true, read: ElementRef}) eraser: HTMLElement;
  @ViewChild('svg', {static: true, read: ElementRef})svg: ElementRef;
  @Input() tool: AbstractTool;
  width: number;
  height: number;
  primaryColor: Color;
  secondaryColor: Color;
  backgroundColor: string;
  currentPath: SVGPathElement | undefined;
  arrowKeysDown: Map<string, boolean>;
  viewGrid: boolean;

  constructor(private renderer: Renderer2, private drawingSizeService: DrawingSizeService, private selectedToolService: SelectedToolService,
              private currentDrawingService: CurrentDrawingDataService, private selectedColors: SelectedColorsService,
              private dismissService: DialogDismissService, private svgService: SvgService, private commandInvoker: CommandInvokerService,
              private eraserService: EraserService, private gallerieDrawing: GallerieDrawingService, private gridService: GridService,
              private clipboardService: ClipBoardService, private continueDrawingService: ContinueDrawingService) {
    this.clipboardService.setDeleteCallback(this.removeSelectionPath.bind(this));
    this.drawingSizeService.widthBS.subscribe( (result: number) => {this.width = result; this.initializeSvgAttribute(); }  );
    this.drawingSizeService.heightBS.subscribe(  (result: number) => {this.height = result; this.initializeSvgAttribute(); });
    this.selectedColors.primaryColorBS.subscribe((result: Color) => {this.primaryColor = result; });
    this.selectedColors.secondaryColorBS.subscribe((result: Color) => {this.secondaryColor = result; });
    this.selectedColors.backgroundColorBS.subscribe((result: Color) => {
      this.backgroundColor = result.strFormat();
      this.initializeSvgAttribute();
      this.viewGrid = false;
    });
    this.eraserService.setRemoveCallBack(this.removePathOfElement.bind(this));
    this.selectedToolService.selectedToolBS.subscribe( (result: AbstractTool) => {
      this.removeSelectionPath();
      this.currentPath = undefined;
      this.tool = result;
    });
    this.dismissService.dismissChanges.subscribe((result) => { if (result) { this.clearDrawing(); }});
    this.gridService.gridActivationSubject.subscribe((val) => { this.viewGrid = val; });
    this.arrowKeysDown = new Map([['ArrowUp', false], ['ArrowRight', false], ['ArrowDown', false], ['ArrowLeft', false]]);
  }
  ngOnInit(): void {
    this.continueDrawingService.open();
    this.eraserService.setRemoveCallBack(this.removePathOfElement.bind(this));
    this.drawingSizeService.newDrawing();
    this.gallerieDrawing.svgStringBS.subscribe( (svgString) => {
      const svg: SVGElement = SvgManager.fromString(svgString);
      let array: Element[];
      array = Array.prototype.slice.call(svg.children).filter((element: SVGPathElement) => TYPES_OF_ELEMENT.includes(element.tagName));
      this.clearDrawing();
      this.commandInvoker.newDrawing();
      for (const elem of array) {
        this.addPathToElement(elem as SVGPathElement);
      }
    });
  }
  ngAfterViewInit(): void {
    this.initializeSvgAttribute();
    this.commandInvoker.defineCallBackFunction(this.addPathToElement.bind(this), this.removePathOfElement.bind(this));
    this.continueDrawingService.autoSaveDrawing();
  }
  initializeSvgAttribute(): void {
    const colorBackgroundAttribut = 'background-color:' + this.backgroundColor;
    if (this.svg !== undefined) {
      this.renderer.setAttribute(this.svg.nativeElement, 'width', this.width.toString());
      this.renderer.setAttribute(this.svg.nativeElement, 'height', this.height.toString());
      this.renderer.setAttribute(this.svg.nativeElement, 'stroke-width', '0px');
      this.renderer.setAttribute(this.svg.nativeElement, 'style', colorBackgroundAttribut);
      this.svgService.svgSubject.next(this.svg.nativeElement);
    }
  }
  handleError(error: Error): void {
    console.error(error); // If a mouseEvent is not implemented by a tool, it will throw an error saying that this event is not implemented
  }
  @HostListener('dragstart', ['$event']) onDrag(event: MouseEvent): void {
    event.preventDefault();
  }
  @HostListener('click', ['$event']) onMouseClick(event: MouseEvent): void {
    try {
      this.appendPathToRootElement(this.tool.onMouseClick(event));
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('mousewheel', ['$event']) onMouseWheel(event: WheelEvent): void {
    try {
      this.tool.onMouseWheel(event);
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('contextmenu', ['$event']) onContextMenu(event: MouseEvent): void {
    if (this.tool.name === SELECTION_TOOL || this.tool.name === PIPETTE) {
      event.preventDefault();
    }
  }
  @HostListener('mousedown', ['$event']) onMouseDownInElement(event: MouseEvent): void {
    try {
      const buttonClicked = event.button;
      if (buttonClicked === LEFT_BUTTON) {
        const returnElement = this.tool.onMouseDownInElement(event, this.primaryColor, this.secondaryColor);
        if (returnElement !== null) {
        this.appendPathToRootElement(returnElement);
        }
      } else {
        const returnElement = this.tool.onRightMouseDownInElement(event, this.secondaryColor);
        if (returnElement !== null) {
        this.appendPathToRootElement(returnElement);
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('document:mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    try {
      const buttonClicked = event.button;
      if (buttonClicked === LEFT_BUTTON) {
        const returnElement = this.tool.onMouseDown(event, this.primaryColor, this.secondaryColor);
        if (returnElement !== null) {
        this.appendPathToRootElement(returnElement);
        }
      } else {
        const returnElement = this.tool.onRightClickDown(event);
        if (returnElement !== null) {
        this.appendPathToRootElement(returnElement);
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('document:mouseup', ['$event']) onMouseUp(event: MouseEvent): void {
    try {
      this.appendPathToRootElement(this.tool.onMouseUp(event));
      this.svgService.svgSubject.next(this.svg.nativeElement);
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('dblclick', ['$event']) onDoubleClick(event: MouseEvent): void {
    try {
      this.appendPathToRootElement(this.tool.onDoubleClick(event));
      this.svgService.svgSubject.next(this.svg.nativeElement);
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('mouseleave', ['$event']) onMouseLeave(event: MouseEvent): void {
    try {
      this.appendPathToRootElement(this.tool.onMouseLeave(event));
      this.svgService.svgSubject.next(this.svg.nativeElement);
    } catch (error) {
      this.handleError(error);
    }
   }
   @HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent): void {
    try {
      this.appendPathToRootElement(this.tool.onMouseEnter(event, this.primaryColor, this.secondaryColor));
    } catch (error) {
      this.handleError(error);
    }
   }
  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    try {
      this.appendPathToRootElement(this.tool.onMouseMove(event));
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('document:keydown.shift', ['$event']) onShiftDown(event: KeyboardEvent): void {
    try {
      const returnElement = this.tool.onShiftDown(event);
      if (returnElement !== null) {
        this.appendPathToRootElement(returnElement);
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('document:keyup.shift', ['$event']) onShiftUp(event: KeyboardEvent): void {
    try {
      const returnElement = this.tool.onShiftUp(event);
      if (returnElement !== null) {
        this.appendPathToRootElement(returnElement);
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('document:keydown.backspace', ['$event']) onBackspaceDown(event: KeyboardEvent): void {
    try {
      this.appendPathToRootElement(this.tool.onBackspaceDown(event));
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('document:keydown.escape', ['$event']) onEscapeClick(event: KeyboardEvent): void {
    try {
      this.appendPathToRootElement(this.tool.onEscapeClick(event));
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('document:keydown.control.a', ['$event']) onControlA(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.tool.name === SELECTION_TOOL) {
      this.appendPathToRootElement((this.tool as unknown as SelectionToolComponent).selectAll());
    }
  }
  @HostListener('document:keydown.control.c', ['$event']) onControlC(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.tool.name === SELECTION_TOOL) {
      this.tool.onCtrlC();
    }
  }
  @HostListener('document:keydown.control.v', ['$event']) onControlV(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.tool.name === SELECTION_TOOL) {
      this.tool.onCtrlV();
    }
  }
  @HostListener('document:keydown.control.x', ['$event']) onControlX(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.tool.name === SELECTION_TOOL) {
      this.tool.onCtrlX();
    }
  }
  @HostListener('document:keydown.control.d', ['$event']) onCtrlD(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.tool.name === SELECTION_TOOL) {
      this.tool.onCtrlD();
    }
  }
  @HostListener('document:keydown.delete', ['$event']) onDelete(event: KeyboardEvent): void {
    if (this.tool.name === SELECTION_TOOL) {
      this.tool.onDelete();
    }
  }
  @HostListener('window:popstate') onPopState(): void {
    this.clearDrawing();
  }
  @HostListener('window:resize') onResize(): void {
    if (this.drawingSizeService.getUserWantsMaxSize()) {
      this.drawingSizeService.updateWidth(window.innerWidth - TOOL_BAR_WIDTH);
      this.drawingSizeService.updateHeight(window.innerHeight);
    }
  }
  @HostListener('window:keydown.control.z', ['$event']) undo(event: KeyboardEvent): void {
    this.commandInvoker.undo();
    this.removeSelectionPath();
    event.stopImmediatePropagation();
  }
  @HostListener('window:keydown.control.shift.z', ['$event']) redo(event: KeyboardEvent): void {
    this.commandInvoker.redo();
    this.removeSelectionPath();
    event.stopImmediatePropagation();
  }
  @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (this.arrowKeysDown.has(event.key)) {
      this.arrowKeysDown.set(event.key, true);
      this.tool.onArrowsChange(this.arrowKeysDown, event);
    }
  }
  @HostListener('document:keyup', ['$event']) onKeyUp(event: KeyboardEvent): void {
    if (this.arrowKeysDown.has(event.key)) {
      this.arrowKeysDown.set(event.key, false);
      this.tool.onArrowsChange(this.arrowKeysDown, event);
    }
  }
  addPathToElement(path: SVGPathElement, translate?: [number, number] ): void {
    this.renderer.appendChild(this.svg.nativeElement, path);
    this.eraserService.addPath(path);
    if (translate) { this.eraserService.refreshTransform([path], translate); }
  }
  removePathOfElement(path: SVGPathElement): void {
    if (path) {
      (this.svg.nativeElement as HTMLElement).removeChild(path);
      this.eraserService.removePath(path);
    }
  }
  appendPathToRootElement(path: SVGPathElement, setRectangle?: boolean): void {
    if (path !== undefined) {
      if (setRectangle) {
        this.currentPath = path;
      }
      this.renderer.appendChild(this.svg.nativeElement, path);
      this.currentDrawingService.addPathToDrawing(path);
    }
  }
  clearDrawing(): void {
    this.currentDrawingService.clearStack();
    while ((this.svg.nativeElement as HTMLElement).childElementCount !== NUMBER_CHILD_NOT_TO_DELETE) {
      (this.svg.nativeElement as HTMLElement).removeChild((this.svg.nativeElement as HTMLElement).lastChild as Node);
    }
    this.svgService.svgSubject.next(this.svg.nativeElement);
  }
  private removeSelectionPath(): void {
    if (this.tool !== undefined && this.tool.name === SELECTION_TOOL) {
      this.removePathOfElement(this.currentPath as SVGPathElement);
      (this.tool as SelectionToolComponent).clearSelection();
    }
  }
}
