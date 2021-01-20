import { AfterViewInit, Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommandInvokerService } from 'src/app/services/drawing/command-invoker.service';
import { DrawingSizeService } from '../../../../services/drawing/drawing-size.service';

const ERROR_BACKGROUND = 'rgb(255,110,110)';
const DEFAULT_BACKGROUND = 'rgb(255,255,255)';
const TOOL_BAR_WIDTH = 120;

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-dialog-new-drawing',
  templateUrl: './dialog-new-drawing.component.html',
  styleUrls: ['./dialog-new-drawing.component.scss']
})
export class DialogNewDrawingComponent implements AfterViewInit {
  widthIsValid: boolean;
  heightIsValid: boolean;
  colorIsConfirmed: boolean;

  @ViewChild('height', {static: false}) heightInput: ElementRef;
  @ViewChild('width', {static: false}) widthInput: ElementRef;

  constructor(public drawingSizeService: DrawingSizeService, public dialog: MatDialog, private commandInvoker: CommandInvokerService ) {
    this.widthIsValid = true;
    this.heightIsValid = true;
   }

  ngAfterViewInit(): void {
    this.heightInput.nativeElement.defaultValue = window.innerHeight.toString();
    this.widthInput.nativeElement.defaultValue = (window.innerWidth - TOOL_BAR_WIDTH).toString();
    this.drawingSizeService.setValuesToDefault();
  }

  onInputChangeWidth(width: number,  event: KeyboardEvent): void {
    event.stopImmediatePropagation();
    this.widthIsValid = this.drawingSizeService.updateWidth(width);
    this.widthInput.nativeElement.style.backgroundColor = this.widthIsValid ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
    this.drawingCanBeCreated();
  }

  onInputChangeHeight(height: number, event: KeyboardEvent): void {
    event.stopImmediatePropagation();
    this.heightIsValid = this.drawingSizeService.updateHeight(height);

    this.heightInput.nativeElement.style.backgroundColor = this.heightIsValid ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
    this.drawingCanBeCreated();
  }

  isSizeValid(): boolean {
    return (this.widthIsValid && this.heightIsValid);
  }

  createNewDrawing(): void {
    this.drawingSizeService.newDrawing();
    this.commandInvoker.newDrawing();
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  buttonIsDisplayed(colorIsConfirmed: boolean): void {
    this.colorIsConfirmed = colorIsConfirmed;
  }

  drawingCanBeCreated(): boolean {
    return this.colorIsConfirmed && this.isSizeValid();
  }
}
