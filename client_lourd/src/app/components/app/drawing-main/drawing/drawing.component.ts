import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { OtherClientDrawingManager } from '../../../../services/clientPathListener/other-client-drawing-manager'
import { GameService } from 'src/app/services/gameServices/game.service';
import { Subscription } from 'rxjs';
const LEFT_BUTTON = 0;
const NUMBER_CHILD_NOT_TO_DELETE = 5;

@Component({
  selector: './drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('svg', {static: true, read: ElementRef})svg: ElementRef;
  @Input() tool: AbstractTool;
  width: number;
  height: number;
  primaryColor: Color;
  currentPath: SVGPathElement | undefined;
  arrowKeysDown: Map<string, boolean>;
  viewGrid: boolean;
  private subscriptions: Subscription[] = []
  constructor(private renderer: Renderer2, private drawingSizeService: DrawingSizeService, private selectedToolService: SelectedToolService,
              private currentDrawingService: CurrentDrawingDataService, private selectedColors: SelectedColorsService,
              private dismissService: DialogDismissService, private svgService: SvgService, private commandInvoker: CommandInvokerService,
              private eraserService: EraserService, private gridService: GridService, private otherClientDrawingManager: OtherClientDrawingManager,
              private gameService: GameService) {
    this.subscriptions.push(this.drawingSizeService.widthBS.subscribe( (result: number) => { this.width = result; this.initializeSvgAttribute(); }  ))
    this.subscriptions.push(this.drawingSizeService.heightBS.subscribe(  (result: number) => { this.height = result; this.initializeSvgAttribute(); }))
    this.subscriptions.push(this.selectedColors.primaryColorBS.subscribe((result: Color) => {this.primaryColor = result; }))
    this.eraserService.setRemoveCallBack(this.removePathOfElement.bind(this));
    this.subscriptions.push(this.selectedToolService.selectedToolBS.subscribe( (result: AbstractTool) => {
      this.currentPath = undefined;
      this.tool = result;
    }))
    this.subscriptions.push(this.dismissService.dismissChanges.subscribe((result) => { if (result) { this.clearDrawing(); }}))
    this.subscriptions.push(this.gridService.gridActivationSubject.subscribe((val) => { this.viewGrid = val; }))
    this.arrowKeysDown = new Map([['ArrowUp', false], ['ArrowRight', false], ['ArrowDown', false], ['ArrowLeft', false]]);
    this.subscriptions.push(this.otherClientDrawingManager.otherClientPath.subscribe( (path) => {
      this.appendPathToRootElement(path)
    }))
    this.subscriptions.push(this.otherClientDrawingManager.pathToErase.subscribe((path) => {
      this.removePathOfElement(path)
    }))
    this.subscriptions.push(this.gameService.newDrawing.subscribe((it) => {
      if(it) {
        this.clearDrawing()
      }
    }))
  }
  ngOnInit(): void {
    this.eraserService.setRemoveCallBack(this.removePathOfElement.bind(this));
    this.drawingSizeService.newDrawing();
  }
  ngAfterViewInit(): void {
    this.initializeSvgAttribute();
    this.commandInvoker.defineCallBackFunction(this.addPathToElement.bind(this), this.removePathOfElement.bind(this));
    this.drawingSizeService.updateWidth(this.svg.nativeElement.clientWidth);
    this.drawingSizeService.updateHeight(this.svg.nativeElement.clientHeight);
  }
  ngOnDestroy(): void {
    for(const subs of this.subscriptions) {
      subs.unsubscribe()
    }
  }
  initializeSvgAttribute(): void {
    if (this.svg !== undefined) {
      this.renderer.setAttribute(this.svg.nativeElement, 'width', this.width.toString());
      this.renderer.setAttribute(this.svg.nativeElement, 'height', this.height.toString());
      this.renderer.setAttribute(this.svg.nativeElement, 'stroke-width', '0px');
      this.svgService.svgSubject.next(this.svg.nativeElement);
    }
  }
  handleError(error: Error): void {
    //console.error(error); // If a mouseEvent is not implemented by a tool, it will throw an error saying that this event is not implemented
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
  @HostListener('mousedown', ['$event']) onMouseDownInElement(event: MouseEvent): void {
    try {
      const buttonClicked = event.button;
      if (buttonClicked === LEFT_BUTTON) {
        this.appendPathToRootElement(this.tool.onMouseDownInElement(event));
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
      this.appendPathToRootElement(this.tool.onMouseEnter(event));
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
      this.appendPathToRootElement( this.tool.onShiftDown(event));
    } catch (error) {
      this.handleError(error);
    }
  }
  @HostListener('document:keyup.shift', ['$event']) onShiftUp(event: KeyboardEvent): void {
    try {
      this.appendPathToRootElement(this.tool.onShiftUp(event));
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
  @HostListener('window:popstate') onPopState(): void {
    this.clearDrawing();
  }
  @HostListener('window:keydown.control.z', ['$event']) undo(event: KeyboardEvent): void {
    this.commandInvoker.undo();
    event.stopImmediatePropagation();
  }
  @HostListener('window:keydown.control.shift.z', ['$event']) redo(event: KeyboardEvent): void {
    this.commandInvoker.redo();
    event.stopImmediatePropagation();
  }
  addPathToElement(path: SVGPathElement, translate?: [number, number] ): void {
    this.renderer.appendChild(this.svg.nativeElement, path);
    this.eraserService.addPath(path);
    if (translate) { this.eraserService.refreshTransform([path], translate); }
  }
  removePathOfElement(path: SVGPathElement): void {
    if (path && (this.svg.nativeElement as HTMLElement).contains(path)) {
      (this.svg.nativeElement as HTMLElement).removeChild(path);
      this.eraserService.removePath(path);
    }
  }
  appendPathToRootElement(path: SVGPathElement | null, setRectangle?: boolean): void {
    if(this.svg != null && this.svg !== undefined) {
      if (path !== undefined && path !== null) {
        this.renderer.appendChild(this.svg.nativeElement, path);
        this.currentDrawingService.addPathToDrawing(path);
      }
    }
  }
  clearDrawing(): void {
    if(this.svg !== null && this.svg !== undefined) {
      this.currentDrawingService.clearStack();
      while ((this.svg.nativeElement as HTMLElement).childElementCount !== NUMBER_CHILD_NOT_TO_DELETE) {
        if(this.svg !== undefined) {
          (this.svg.nativeElement as HTMLElement).removeChild((this.svg.nativeElement as HTMLElement).lastChild as Node);
        }
      }
      this.svgService.svgSubject.next(this.svg.nativeElement);
    }
  }
}
