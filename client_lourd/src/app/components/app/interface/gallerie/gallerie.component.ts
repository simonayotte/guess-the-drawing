import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog } from '@angular/material';
import { MetaDataDB } from 'src/app/models/meta-data-bd';
import { SaveDrawingService } from 'src/app/services/drawing/save-drawing.service';
import { GallerieService } from 'src/app/services/gallerie-services/gallerie/gallerie.service';

const ERROR_BACKGROUND = 'rgb(255,110,110)';
const DEFAULT_BACKGROUND = 'rgb(255,255,255)';

@Component({
  selector: 'app-gallerie',
  templateUrl: './gallerie.component.html',
  styleUrls: ['./gallerie.component.scss']
})
export class GallerieComponent implements OnInit {

  private tag: string;
  tags: string[];
  metaDataDB: MetaDataDB[];
  tempMetaDataDB: MetaDataDB[];
  loading: boolean;

  @ViewChild('btnAddTag') btnAdd: MatButton;
  @ViewChild('tag') tagInput: ElementRef;

  constructor(private gallerieService: GallerieService, private saveDrawingService: SaveDrawingService, public dialog: MatDialog,
              private cdref: ChangeDetectorRef) {
    this.tag = '';
    this.tags = [];
    this.loading = true;
    this.metaDataDB = [];
    this.tempMetaDataDB = [];
   }

  ngOnInit(): void {
    this.gallerieService.getAllDrawingHTTP().subscribe( (metaData) => {
      this.gallerieService.setDrawings(metaData);
      this.metaDataDB = this.gallerieService.getMetaData();
      this.tempMetaDataDB = this.metaDataDB;
      this.cdref.detectChanges();
      this.gallerieService.loadPreviewImages(document);
      this.loading = false;
    });
   }

  search(): void {

    this.metaDataDB = this.tempMetaDataDB;
    this.cdref.detectChanges();
    this.gallerieService.loadPreviewImages(document);

  }

  openDrawing(metaDataBD: MetaDataDB): void {
    this.gallerieService.openDrawing(metaDataBD);
    this.dialog.closeAll();
  }

  isDrawings(): boolean {
    return !this.gallerieService.isDrawings(this.metaDataDB);
  }

  deleteDrawing(id: string): void {
    this.metaDataDB = this.gallerieService.deleteDrawing(id, this.tags);
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

  btnAddTag(): boolean {
    this.btnAdd.disabled = !(this.tagIsValid(this.tag));
    return this.btnAdd.disabled;
  }

  addTag(): void {
    if (this.tagIsValid(this.tag)) {
      this.tags.push(this.tag);
    }
    this.tag = '';
    this.btnAddTag();
    this.tempMetaDataDB = this.gallerieService.tagSearch(this.tags);
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    this.tags.splice(index, 1);
    this.tempMetaDataDB = this.gallerieService.tagSearch(this.tags);
  }

  resetValue(): void {
    this.tagInput.nativeElement.value = '';
  }

}
