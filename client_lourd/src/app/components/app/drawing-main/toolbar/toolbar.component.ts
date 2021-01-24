import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Injectable,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DialogService } from '../../../../../../src/app/services/Dialog/dialog.service';
import { DialogIsOpenError } from '../../../../errors/dialog-is-open';
import { SelectedColorsService } from '../../../../services/color-picker/selected-colors.service';
import { CommandInvokerService } from '../../../../services/drawing/command-invoker.service';
import { GridService } from '../../../../services/grid-service/grid.service';
import { SelectedToolService } from '../../../../services/selected-tool/selected-tool.service';
import { AerosolComponent } from '../../tools/aerosol-tool/aerosol/aerosol.component';
import { Color } from '../../tools/color-picker/color';
import { PaintBrushComponent } from '../../tools/drawingTools/paint-brush/paint-brush.component';
import { PencilComponent } from '../../tools/drawingTools/pencil/pencil.component';
import { EraserComponent } from '../../tools/eraser/eraser.component';
import { GridAttributesComponent } from '../../tools/grid-attributes/grid-attributes.component';
import { LineToolComponent } from '../../tools/line-tool/line-tool.component';
import { PaintBucketComponent } from '../../tools/paint-bucket/paint-bucket.component';
import { PipetteComponent } from '../../tools/pipette/pipette.component';
import { EllipseComponent } from '../../tools/shapeTools/ellipse/ellipse/ellipse.component';
import { PolygoneComponent } from '../../tools/shapeTools/polygone/polygone/polygone.component';
import { ToolButton } from '../../tools/tool-button';

const PENCIL = 0;
const BRUSH = 1;
const AEROSOL = 2;
const ERASER = 3;
const LINE = 4;
const POLYGONE = 6;
const ELLIPSE = 7;
const PIPETTE = 9;
const PAINT_BUCKET = 12;
const BACKGROUND_COLOR = 2;

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: './toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements AfterViewInit {
  buttons: ToolButton[];
  selectedButton: ToolButton;
  changePrimaryColor: boolean;
  changeSecondaryColor: boolean;
  primaryColor: Color;
  secondaryColor: Color;
  primaryColorString: string;
  secondaryColorString: string;
  toolSelected: boolean;
  undoAvailable: boolean;
  showColorPicker: boolean;
  redoAvailable: boolean;
  rootElement: ElementRef;
  gridActivation: boolean;

  @ViewChild('toolContainer', {static: true, read: ViewContainerRef}) entry: ViewContainerRef;
  @ViewChild('sliderPrim', {static: true}) sliderPrim: ElementRef;
  @ViewChild('sliderSec', {static: true}) sliderSec: ElementRef;

  constructor(private dialogService: DialogService, lineToolComponent: LineToolComponent, paintBrushComponent: PaintBrushComponent,
              pencilComponent: PencilComponent, private selectedToolService: SelectedToolService, private renderer: Renderer2,
              private selectedColorService: SelectedColorsService, private commandInvoker: CommandInvokerService,
              aerosol: AerosolComponent, eraser: EraserComponent, polygoneComponent: PolygoneComponent,
              ellipseComponent: EllipseComponent, pipetteComponent: PipetteComponent,
              gridAttributesComponent: GridAttributesComponent, private ref: ChangeDetectorRef, private gridService: GridService,
              paintBucketComponent: PaintBucketComponent) {
      this.buttons = [
        {name: 'Crayon', tool: pencilComponent, iconName: 'pencil', category: 'drawingTool'},
        {name: 'Pinceau', tool: paintBrushComponent, iconName: 'brush', category: 'drawingTool'},
        {name: 'Aérosol', tool : aerosol, iconName: 'aerosol', category: 'drawingTool'},
        {name: 'Efface', tool : eraser, iconName: 'eraser', category: 'drawingTool'},
        {name: 'Ligne', tool: lineToolComponent, iconName: 'line', category: 'shapeTool'},
        {name: 'Polygone', tool : polygoneComponent, iconName: 'polygon', category: 'shapeTool'},
        {name: 'Ellipse', tool : ellipseComponent, iconName: 'ellipse', category: 'shapeTool'},
        {name: 'Pipette', tool : pipetteComponent, iconName: 'pipette', category: 'otherTool'},
        {name: 'Grille', tool : gridAttributesComponent, iconName: 'grid', category: 'otherTool'},
        {name: 'Sceau de peinture', tool : paintBucketComponent, iconName: 'bucket', category: 'otherTool'}
      ];
      this.selectedButton = this.buttons[0];

      for (const button of this.buttons) {
        try {
        button.tool.initializeRenderer(this.renderer);
        } catch (error) {
          // We just want to initialize the renderer of every tool that uses it.
          // By default, if a tool doesnt use it, it throws an error.
          // However, we dont need to print in the console which tool use it or not, so we dont have to do anything
          // in this catch block
        }
      }

      this.selectedColorService.primaryColorBS.subscribe((result) => {
        this.primaryColor = result;
        this.primaryColorString = this.primaryColor.strFormat();
        if (this.sliderPrim) {
          this.sliderPrim.nativeElement.value = this.primaryColor.getA();
        }
      });
      this.selectedColorService.secondaryColorBS.subscribe((result) => {
        this.secondaryColor = result;
        this.secondaryColorString = this.secondaryColor.strFormat();
        if (this.sliderSec) {
          this.sliderSec.nativeElement.value = this.secondaryColor.getA();
        }
      });
      this.commandInvoker.displayStatusUndoRedoBtn.subscribe((result) => {
        this.undoAvailable = result[0];
        this.redoAvailable = result[1];
      });

      this.gridService.gridActivationSubject.subscribe((isActive) => {
        this.gridActivation = isActive;
      });

      this.toolSelected = false;
      this.undoAvailable = false;
      this.showColorPicker = false;
      this.redoAvailable = false;
  }

  ngAfterViewInit(): void {
    this.selectedToolService.selectedToolBS.next(this.selectedButton.tool);
    this.ref.detectChanges();
  }

  getSelectedButton(): ToolButton {
    return this.selectedButton;
  }

  onSelect(button: ToolButton): void {
    if (this.selectedButton === button && !this.toolSelected) {
      this.toolSelected = true;
    } else if (this.selectedButton === button && this.toolSelected) {
      this.toolSelected = false;
    } else {
      this.toolSelected = true;
      this.selectedButton = button;
    }
    this.selectedToolService.selectedToolBS.next(this.selectedButton.tool);
  }

  openColorPicker(selectedColorChange: number): void {
    this.dialogService.openColorPicker(selectedColorChange);
  }

  @HostListener('window:keydown.g', ['$event']) onG(event: KeyboardEvent): void {
    if (!this.dialogService.hasOpenDialog()) {
      this.gridService.gridActivationSubject.next(!this.gridActivation);
    }
  }

  @HostListener('document:keyup.a', ['$event']) aerosolToolShortcut(): void {
    this.selectButton(AEROSOL);
  }

  @HostListener('document:keyup.w', ['$event']) brushToolShortcut(): void {
    this.selectButton(BRUSH);
  }

  @HostListener('document:keyup.c', ['$event']) pencilToolShortcut(): void {
    this.selectButton(PENCIL);
  }

  @HostListener('document:keyup.l', ['$event']) lineToolShortcut(): void {
    this.selectButton(LINE);
  }

  @HostListener('document:keyup.i', ['$event']) pipetteShortcut(): void {
    this.selectButton(PIPETTE);
  }

  @HostListener('document:keyup.e', ['$event']) eraserShortcut(): void {
    this.selectButton(ERASER);
  }

  @HostListener('document:keyup.3', ['$event']) polygoneShortcut(): void {
    this.selectButton(POLYGONE);
  }

  @HostListener('document:keyup.2', ['$event']) ellipseShortcut(): void {
    this.selectButton(ELLIPSE);
  }

  @HostListener('document:keyup.b', ['$event']) paintBucketShortcut(): void {
    this.selectButton(PAINT_BUCKET);
  }

  @HostListener('window:keydown.control.s', ['$event']) onCtrlS(event: KeyboardEvent): void {
    event.preventDefault();
    this.openSaveDrawingDialog();
  }

  @HostListener('window:keydown.control.e', ['$event']) onCtrlE(event: KeyboardEvent): void {
    event.preventDefault();
    this.openExportDialog();
  }

  openNewDrawingDialog(): void {
    this.dialogService.openNewDrawingDialogs();
  }

  openUserGuideDialog(): void {
    this.dialogService.openUserGuideDialog();
  }

  openExportDialog(): void {
    this.selectedToolService.selectedToolBS.next(this.selectedButton.tool);
    this.dialogService.openExportDialog();
  }

  openSaveDrawingDialog(): void {
    this.selectedToolService.selectedToolBS.next(this.selectedButton.tool);
    this.dialogService.openSaveDrawingDialog();
  }

  changeBackgroundColor(): void {
    this.dialogService.openColorPicker(BACKGROUND_COLOR);
  }

  switchPrimaryAndSecondary(): void {
    const tmpColor = this.primaryColor;
    this.sliderPrim.nativeElement.valueAsNumber = this.secondaryColor.getA();
    this.sliderSec.nativeElement.valueAsNumber = this.primaryColor.getA();
    this.selectedColorService.primaryColorBS.next(this.secondaryColor);
    this.selectedColorService.secondaryColorBS.next(tmpColor);
  }

  changePrimaryAlpha(event: Event): void {
    this.primaryColor.setA((event.target as HTMLInputElement).valueAsNumber);
    this.selectedColorService.primaryColorBS.next(this.primaryColor);
  }

  changeSecondaryAlpha(event: Event): void {
    this.secondaryColor.setA((event.target as HTMLInputElement).valueAsNumber);
    this.selectedColorService.secondaryColorBS.next(this.secondaryColor);
  }

  undo(): void {
    this.commandInvoker.undo();
  }

  redo(): void {
    this.commandInvoker.redo();
  }

  private selectButton(toolIndex: number): void {
    if (!this.dialogService.hasOpenDialog()) {
      this.onSelect(this.buttons[toolIndex]);
    } else {
      throw(new DialogIsOpenError('une fenetre est deja ouverte'));
    }
  }
}
