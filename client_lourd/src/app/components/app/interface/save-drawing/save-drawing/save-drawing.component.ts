import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog, MatSnackBar } from '@angular/material';
import { ExporterService } from 'src/app/services/exporter-service/exporter.service';
import { SvgService } from 'src/app/services/svg-service/svg.service';
import { SaveDrawingService } from '../../../../../services/drawing/save-drawing.service';

const ERROR_BACKGROUND = 'rgb(255,110,110)';
const DEFAULT_BACKGROUND = 'rgb(255,255,255)';

@Component({
  selector: 'app-save-drawing',
  templateUrl: './save-drawing.component.html',
  styleUrls: ['./save-drawing.component.css']
})

@Injectable()
export class SaveDrawingComponent implements OnInit {

  private name: string;
  private tag: string;
  private svgElement: SVGElement;
  tags: string[];

  @ViewChild('btnAddTag') btnAdd: MatButton;
  @ViewChild('btnSaveDrawing') btnSave: MatButton;
  @ViewChild('name') nameInput: ElementRef;
  @ViewChild('tag') tagInput: ElementRef;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('exportCanvas', {static: true})
  exportCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private saveDrawingService: SaveDrawingService, public dialog: MatDialog, private svgService: SvgService,
              private exporterService: ExporterService, private confirmationBar: MatSnackBar) {
    this.name = '';
    this.tag = '';
    this.tags = [];
  }

  ngOnInit(): void {
    this.svgService.svgSubject.subscribe((svg) => {
      this.svgElement = svg;
      this.exporterService.updatePreviewCanvas(this.svgElement, this.canvas.nativeElement);
    });
  }

  onInputChangeName(name: string, event: KeyboardEvent): void {
    event.stopImmediatePropagation();
    this.name = (this.nameIsValid(name)) ? name : '';
    this.nameInput.nativeElement.style.backgroundColor = this.nameIsValid(name) ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
    this.btnSave.disabled = !(this.nameIsValid(name));
  }

  onInputChangeTag(tag: string, event: KeyboardEvent): void {
    event.stopImmediatePropagation();
    this.tag = (this.tagIsValid(tag)) ? tag : '';
    this.tagInput.nativeElement.style.backgroundColor = this.tagIsValid(tag) ? DEFAULT_BACKGROUND : ERROR_BACKGROUND;
    this.btnAdd.disabled = !(this.tagIsValid(tag));
  }

  private tagIsValid(tag: string): boolean {
    return this.saveDrawingService.nameIsValid(tag);
  }

  private nameIsValid(name: string): boolean {
    return this.saveDrawingService.nameIsValid(name);
  }

  btnAddTag(): boolean {
    this.btnAdd.disabled = !(this.tagIsValid(this.tag));
    return this.btnAdd.disabled;
  }

  btnSaveDrawing(): boolean {
    this.btnSave.disabled = !(this.nameIsValid(this.name));
    return this.btnSave.disabled;
  }

  saveDrawing(): void {
    try {
      this.saveDrawingService.saveDrawing(this.name, this.tags, this.svgElement);
      this.confirmationBar.open('The drawing was saved successfully', 'Close', {
        duration: 3000
      });
    } catch (error) {
      this.confirmationBar.open('** An error occured!! Please try again!! **', 'Close', {
        duration: 3000
      });
    }
    this.closeDialog();
  }

  addTag(): void {
    if (this.tagIsValid(this.tag)) {
      this.tags.push(this.tag);
    }
    this.tag = '';
    this.btnAddTag();
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    this.tags.splice(index, 1);
  }

  resetValue(): void {
    this.tagInput.nativeElement.value = '';
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
