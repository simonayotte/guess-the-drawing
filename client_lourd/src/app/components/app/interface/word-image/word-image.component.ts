import { Component, OnInit, Renderer2 } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { WordImageService } from 'src/app/services/word-image/word-image.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../basic-dialog/basic-dialog.component';
import { FileHandler } from '../image-upload/file-handle/file-handle';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider/slider';
import { WordImagePreviewComponent } from '../word-image-preview/word-image-preview.component';

export const PANORAMIC = 'panoramic';

@Component({
  selector: 'app-word-image',
  templateUrl: './word-image.component.html',
  styleUrls: ['./word-image.component.scss']
})

export class WordImageComponent implements AfterViewInit, OnInit {
  @ViewChild('svg', {static: true, read: ElementRef})svg: ElementRef;
  @ViewChild('svgquickdraw', {static: true, read: ElementRef})svgquickdraw: ElementRef;
  @ViewChild('objectquickdraw', {static: true, read: ElementRef})objectquickdraw: ElementRef;
  @ViewChild('name', {static: true, read: ElementRef})drawingName: ElementRef;
  @ViewChild('wordImagePreview') wordImagePreview: WordImagePreviewComponent;

  readonly IMPORT = 'import';
  readonly DRAW = 'draw';
  readonly QUICKDRAW = 'quickdraw'


  public creationMode: string = this.DRAW;
  public drawingMode: string = 'classic';
  public difficulty: number = 1;
  public drawingModeOptionPanoramic: string = 'left-right';
  public drawingModeOptionCentered: string = "outwards";
  public turdSize: number = 2;
  public alphaMax: number = 1;
  public optCurve: string = "false";
  public optTolerence: number = 0.2;
  public thresholdAuto: string = 'true';
  public colorThreshold: number = 125;
  public showPreview: string = 'false';
  public svgLink: string = "https://storage.googleapis.com/artlab-public.appspot.com/stencils/Erin-Butner/balloon-01.svg";
  private incrementer = 0 ;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  hints: string[] = [];
  public methode: string = 'draw';
  public wordForm : FormGroup;
  uploadedFile: FileHandler;

  constructor(private formBuilder: FormBuilder,private wordImage: WordImageService, private dialog: MatDialog, private renderer: Renderer2) {}

  ngOnInit() {
    this.wordForm = this.formBuilder.group({
      word: new FormControl(''),
    });
  }

  ngAfterViewInit(): void {
    this.renderer.setAttribute(this.svg.nativeElement, 'width', "896");
    this.renderer.setAttribute(this.svg.nativeElement, 'height', "602");
    this.renderer.setAttribute(this.svgquickdraw.nativeElement, 'width', "896");
    this.renderer.setAttribute(this.svgquickdraw.nativeElement, 'height', "602");
  }

  async populateQuickdraw() {
    await this.wordImage.populateQuickdraw(this.incrementer++);
  }

  async generateQuickDraw() {
    const quickdraw = await this.wordImage.getQuickdrawSvg();
    const drawingWord = quickdraw[0]
    const drawingSvg = quickdraw[1]
    this.drawingName.nativeElement.value = drawingWord;
    this.wordForm.value.word = drawingWord;

    const svg = this.wordImage.transformPathToElementQuickdraw(drawingSvg);

    for(const child of this.svgquickdraw.nativeElement.children){
      this.renderer.removeChild(this.svgquickdraw.nativeElement, child);
    }

    while (svg.children.length !== 0){
      this.renderer.appendChild(this.svgquickdraw.nativeElement, svg.children[0]);
    }

  }

  createPair(): void {
    if(this.allInfoInserted()){
      this.wordImage.savePairMotImage(this.wordForm.value.word , this.difficulty, this.hints, this.drawingMode, this.drawingMode === PANORAMIC? this.drawingModeOptionPanoramic : this.drawingModeOptionCentered, this.creationMode, );
      if(this.methode === this.IMPORT){
        this.svg.nativeElement.innerHTML = '';
      }
      this.resetParameter();
    }
  }

  filesDropped(files: any[]) {
    this.uploadedFile = files[0];
    const fileType = this.uploadedFile.file.type.substring(this.uploadedFile.file.type.lastIndexOf('/') + 1);

    if(fileType === 'png' || fileType === 'jpeg' || fileType === 'bmp' || fileType === 'jpg'){
      const potrace = require('potrace');
      const trace = new potrace.Potrace();

      if(this.optCurve === "true" && this.thresholdAuto === "false"){
        trace.setParameters({
          turdSize: this.turdSize,
          alphaMax: this.alphaMax,
          optTolerence: this.optTolerence,
          threshold: this.colorThreshold
        });
      } else if(this.optCurve === "true"){
        trace.setParameters({
          turdSize: this.turdSize,
          alphaMax: this.alphaMax,
          optTolerence: this.optTolerence,
        });
      } else if (this.thresholdAuto === "false"){
        trace.setParameters({
          turdSize: this.turdSize,
          alphaMax: this.alphaMax,
          threshold: this.colorThreshold
        });
      } else {
        trace.setParameters({
          turdSize: this.turdSize,
          alphaMax: this.alphaMax,
          optCurve: false,
        });
      }

      trace.loadImage(files[0].url.changingThisBreaksApplicationSecurity, (err: any) => {
        if (err) throw err;

        const svg = this.wordImage.transformPathToElement(trace.getSVG());

        for(const child of this.svg.nativeElement.children){
          this.renderer.removeChild(this.svg.nativeElement, child);
        }

        while (svg.children.length !== 0){
          this.renderer.appendChild(this.svg.nativeElement, svg.children[0]);
        }
      });
    } else {
      this.showDialog("Le type de fichier " + fileType + " n'est pas supporté")
    }

  }

  recompileImage(){
    if(this.uploadedFile !== undefined){
      this.filesDropped([this.uploadedFile]);
    }
  }

  imagePreview(){
    this.showPreview = 'true';
    this.wordImagePreview.imagePreview(this.wordImage.returnChildren(this.creationMode), this.difficulty, this.drawingMode, this.drawingMode === PANORAMIC? this.drawingModeOptionPanoramic : this.drawingModeOptionCentered);
  }

  private resetParameter(): void{
    this.drawingMode = 'random';
    this.drawingModeOptionPanoramic = 'left-right';
    this.drawingModeOptionCentered = "outwards";
    this.hints = [];
    this.wordForm.patchValue({word: ''});
  }

  private allInfoInserted(): boolean{
    if(this.wordForm.value.word === ''){
      this.showDialog('Le champ du mot à deviner ne doit pas être vide!');
      return false;
    } else if(this.hints.length === 0){
      this.showDialog('Vous devez rentrer au moins 1 indice!');
      return false;
    }else if(this.hints.length > 3){
      this.showDialog('Vous devez rentrer au maximum 3 indices!');
      return false;
    }else{
      return true;
    }
  }

  public hidePreview(){
    this.showPreview = 'false';
    this.wordImagePreview.setDraw(false);
  }

  private showDialog(message: string): MatDialogRef<BasicDialogComponent, {data: {message: string}}> {
    return this.dialog.open(BasicDialogComponent, { data: {message}});
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.hints.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  showDraw(){
    return this.methode !== this.DRAW;
  }

  showImport(){
    return this.methode !== this.IMPORT;
  }

  showQuickDraw(){
    return this.methode !== this.QUICKDRAW;
  }

  switchMethode(methode: string){
    this.methode = methode;
    if(methode === this.IMPORT && this.drawingMode === 'classic'){
      this.drawingMode = 'random';
    }
  }

  remove(hint: string): void {
    const index = this.hints.indexOf(hint);

    if (index >= 0) {
      this.hints.splice(index, 1);
    }
  }

  onValueChangeTurdSize(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    if (!this.isValidSize(value, 0, 100)) {
      this.turdSize = 2;
    }
  }

  onSliderChangeTurdSize(event: MatSliderChange): void {
    if (event.value !== null) {
      this.turdSize = event.value;
    }
  }

  onValueChangeAlphaMax(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    if (!this.isValidSize(value, 0, 1.3)) {
      this.alphaMax = 1;
    }
  }

  onSliderChangeAlphaMax(event: MatSliderChange): void {
    if (event.value !== null) {
      this.alphaMax = event.value;
    }
  }

  onValueChangeOptTolerence(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    if (!this.isValidSize(value, 0, 1)) {
      this.optTolerence = 0.2;
    }
  }

  onSliderChangeOptTolerence(event: MatSliderChange): void {
    if (event.value !== null) {
      this.optTolerence = event.value;
    }
  }

  onValueChangeColorThreshold(event: Event): void {
    event.stopImmediatePropagation();
    const value = +(event.target as HTMLInputElement).value;
    if (!this.isValidSize(value, 0, 255)) {
      this.colorThreshold = 125;
    }
  }

  onSliderChangeColorThreshold(event: MatSliderChange): void {
    if (event.value !== null) {
      this.colorThreshold = event.value;
    }
  }

  isValidSize(size: number, min: number, max: number): boolean {
    return (!(isNaN(Number(size)) || size < min || !(size) || size > max));
  }
}
