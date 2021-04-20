import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injectable,
  Input,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { SelectedColorsService } from '../../../../services/color-picker/selected-colors.service';
import { CommandInvokerService } from '../../../../services/drawing/command-invoker.service';
import { GridService } from '../../../../services/grid-service/grid.service';
import { SelectedToolService } from '../../../../services/selected-tool/selected-tool.service';
import { Color } from '../../tools/color-picker/color';
import { PencilComponent } from '../../tools/drawingTools/pencil/pencil.component';
import { EraserComponent } from '../../tools/eraser/eraser.component';
import { GridAttributesComponent } from '../../tools/grid-attributes/grid-attributes.component';
import { ToolButton } from '../../tools/tool-button';
import { RendererProviderService } from '../../../../services/rendererProvider/renderer-provider.service'

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
  selectedColor: Color;
  selectedColorString: string;
  undoAvailable: boolean;
  showColorPicker: boolean;
  redoAvailable: boolean;
  rootElement: ElementRef;
  gridActivation: boolean;
  @Input() disabled: boolean = false;

  @ViewChild('toolContainer', {static: true, read: ViewContainerRef}) entry: ViewContainerRef;
  @ViewChild('sliderAlpha', {static: true}) sliderAlpha: MatSlider;

  constructor(pencilComponent: PencilComponent, private selectedToolService: SelectedToolService, private renderer: Renderer2,
              private selectedColorService: SelectedColorsService, private commandInvoker: CommandInvokerService,
              eraser: EraserComponent,
              gridAttributesComponent: GridAttributesComponent, private ref: ChangeDetectorRef, private gridService: GridService,
              private rendererProvider: RendererProviderService) {
      this.buttons = [
        {name: 'Crayon', tool: pencilComponent, iconName: 'pencil', category: 'drawingTool'},
        {name: 'Efface', tool : eraser, iconName: 'eraser', category: 'drawingTool'},
        {name: 'Grille', tool : gridAttributesComponent, iconName: 'grid', category: 'otherTool'}
      ];
      this.selectedButton = this.buttons[0];
      this.rendererProvider.setRendererInstance(this.renderer);
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
        this.selectedColor = result;
        this.selectedColorString = this.selectedColor.strFormat();
        if (this.sliderAlpha) {
          this.sliderAlpha.value = this.selectedColor.getA();
        }
      });
      this.commandInvoker.displayStatusUndoRedoBtn.subscribe((result) => {
        this.undoAvailable = result[0];
        this.redoAvailable = result[1];
      });

      this.gridService.gridActivationSubject.subscribe((isActive) => {
        this.gridActivation = isActive;
      });

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
    this.selectedButton = button;
    this.selectedToolService.selectedToolBS.next(this.selectedButton.tool);
  }

  changeAlpha(event: MatSliderChange): void {
    if(event.value != null){
      this.selectedColor.setA(event.value * Color.MAX_ALPHA);
      this.selectedColorService.primaryColorBS.next(this.selectedColor);
    }
  }

  undo(): void {
    this.commandInvoker.undo();
  }

  redo(): void {
    this.commandInvoker.redo();
  }
}
