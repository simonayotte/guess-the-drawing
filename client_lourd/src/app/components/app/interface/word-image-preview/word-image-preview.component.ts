import { Renderer2 } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component} from '@angular/core';
import { WordImagePreviewService } from 'src/app/services/word-image-preview/word-image-preview.service';

@Component({
  selector: 'app-word-image-preview',
  templateUrl: './word-image-preview.component.html',
  styleUrls: ['./word-image-preview.component.scss']
})

export class WordImagePreviewComponent implements AfterViewInit{
  @ViewChild('svg', {static: true, read: ElementRef})svg: ElementRef;

  constructor(private renderer: Renderer2, private wordImagePreview:  WordImagePreviewService) { }


  ngAfterViewInit(): void {
    this.renderer.setAttribute(this.svg.nativeElement, 'width', "896");
    this.renderer.setAttribute(this.svg.nativeElement, 'height', "602");
    this.wordImagePreview.initialseRenderer(this.renderer);
  }

  public imagePreview(children: HTMLCollection, difficulty: number, drawingMode: string, drawingModeOption: string){
    this.wordImagePreview.imagePreview(this.svg, children, difficulty, drawingMode, drawingModeOption);
  }

  public setDraw(value: boolean){
    this.wordImagePreview.draw = value;
  }

}
