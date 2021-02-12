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
import { Color } from '../../tools/color-picker/color';
import { PencilComponent } from '../../tools/drawingTools/pencil/pencil.component';
import { EraserComponent } from '../../tools/eraser/eraser.component';
import { GridAttributesComponent } from '../../tools/grid-attributes/grid-attributes.component';
import { ToolButton } from '../../tools/tool-button';

const PENCIL = 0;
const ERASER = 3;
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

  constructor(private dialogService: DialogService,
              pencilComponent: PencilComponent, private selectedToolService: SelectedToolService, private renderer: Renderer2,
              private selectedColorService: SelectedColorsService, private commandInvoker: CommandInvokerService,
              eraser: EraserComponent,
              gridAttributesComponent: GridAttributesComponent, private ref: ChangeDetectorRef, private gridService: GridService) {
      this.buttons = [
        {name: 'Crayon', tool: pencilComponent, iconName: 'pencil', category: 'drawingTool'},
        {name: 'Efface', tool : eraser, iconName: 'eraser', category: 'drawingTool'},
        {name: 'Grille', tool : gridAttributesComponent, iconName: 'grid', category: 'otherTool'}
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
  @HostListener('document:keyup.c', ['$event']) pencilToolShortcut(): void {
    this.selectButton(PENCIL);
  }

  @HostListener('document:keyup.e', ['$event']) eraserShortcut(): void {
    this.selectButton(ERASER);
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
