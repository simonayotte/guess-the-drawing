import { Directive, HostListener, EventEmitter, Output, HostBinding } from '@angular/core';
import { FileHandler } from '../file-handle/file-handle';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appImageDrag]',
})

export class ImageDragDirective {
  // tslint:disable-next-line: no-output-rename
  @Output('files') files: EventEmitter < FileHandler[] > = new EventEmitter();
  @HostBinding('style.background') public background = '#eee';

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    const files: FileHandler[] = [];

    if(evt.dataTransfer != null){
      const file = evt.dataTransfer.files[0];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push({
        file,
        url
      });
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}