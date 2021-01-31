import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GallerieComponent } from 'src/app/components/app/interface/gallerie/gallerie.component';
import { ExporterComponent } from '../../components/app/exporter/exporter.component';
import { DialogDismissDrawingComponent } from '../../components/app/interface/dialog-dismiss-drawing/dialog-dismiss-drawing.component';
import { DialogNewDrawingComponent } from '../../components/app/interface/dialog-new-drawing/dialog-new-drawing.component';
import { SaveDrawingComponent } from '../../components/app/interface/save-drawing/save-drawing/save-drawing.component';
import { ColorPickerComponent } from '../../components/app/tools/color-picker/color-picker.component';
import { UserGuideComponent } from '../../components/app/user-guide/user-guide/user-guide.component';
import { ScreenHeightIsUndefinedError } from '../../errors/screen-height-is-undefined';
import { ScreenWitdhIsUndefinedError } from '../../errors/screen-width-is-undefined';
import { SelectedColorsService } from '../color-picker/selected-colors.service';
import { ContinueDrawingService } from '../continue-drawing/continue-drawing.service';
import { CurrentDrawingDataService } from '../drawing/current-drawing-data.service';
import { DialogDismissService } from './dialog-dismiss.service';

const DISMISS_H = '200px';
const DISMISS_W = '500px';
const DIALOG_W = '400px';
const DIALOG_H = '500px';
const NEW_DRAWING_H = '860px';
const NEW_DRAWING_W = '500px';
const EXPORT_W = '650px';
const EXPORT_H = '900px';
const PIXEL = 'px';
const BACKGROUND_COLOR_NOT_CLOSE = 3;

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dismiss: boolean;

  constructor(public dialog: MatDialog,
              private currentDrawingService: CurrentDrawingDataService,
              private dialogDimissService: DialogDismissService,
              private selectedColorsService: SelectedColorsService,
              private continueDrawingService: ContinueDrawingService
              ) {
    this.dialogDimissService.dismissChanges.subscribe((result) => {
      this.dialog.closeAll();
      if (result && this.dialogDimissService.dialogToOpenNext.value === 'NewDrawing' ) {
        this.openNewDrawingDialog();
      } else if (result && this.dialogDimissService.dialogToOpenNext.value === 'Gallerie') {
        this.dialog.open(GallerieComponent, {height: this.getScreenHeight(), width: this.getScreenWidth() } );
      }
    });
  }

  openNewDrawingDialogs(): void {
    if (!this.hasOpenDialog()) {
      if (this.currentDrawingService.drawingIsEmpty() && !this.continueDrawingService.isDrawingInLocalStorage()) {
        this.openNewDrawingDialog();
      } else {
        this.dialogDimissService.dialogToOpenNext.next('NewDrawing');
        this.dialog.open(DialogDismissDrawingComponent, { height: DISMISS_H, width: DISMISS_W });

      }
    }
  }

  openUserGuideDialog(): void {
    if (!this.hasOpenDialog()) {
      this.dialog.open(UserGuideComponent, { height: this.getScreenHeight(), width: this.getScreenWidth() });
    }
  }

  openColorPicker(selectedColorChange: number): void {
    this.selectedColorsService.selectColorChangeBS.next(selectedColorChange);
    this.dialog.open(ColorPickerComponent, { height: DIALOG_H, width: DIALOG_W });
  }

  openSaveDrawingDialog(): void {
    if (!this.hasOpenDialog()) {
      this.dialog.open(SaveDrawingComponent, { height: this.getScreenHeight(), width: this.getScreenWidth() });
    }
  }

  openGallerie(): void {
    if (!this.hasOpenDialog()) {
      if (this.currentDrawingService.drawingIsEmpty() && !this.continueDrawingService.isDrawingInLocalStorage()) {
        this.dialog.open(GallerieComponent, {height: this.getScreenHeight(), width: this.getScreenWidth() } );
      } else {
        this.dialogDimissService.dialogToOpenNext.next('Gallerie');
        this.dialog.open(DialogDismissDrawingComponent, { height: DISMISS_H, width: DISMISS_W });
      }
    }
  }

  openExportDialog(): void {
    if (!this.hasOpenDialog()) {
      this.dialog.open(ExporterComponent, { height: EXPORT_H, width: EXPORT_W });
    }
  }

  hasOpenDialog(): boolean {
    return this.dialog.openDialogs.length !== 0;
  }

  private getScreenHeight(): string {
    const height = window.innerHeight;
    if (height !== undefined) {
      return String(height) + PIXEL;
    } else {
      throw new ScreenHeightIsUndefinedError('Screen height undefined');
    }
  }

  private getScreenWidth(): string {
    const width = window.innerWidth;
    if (width !== undefined) {
      return String(width) + PIXEL;
    } else {
      throw new ScreenWitdhIsUndefinedError('Screen Width undefined');
    }
  }

  private openNewDrawingDialog(): void {
    this.selectedColorsService.selectColorChangeBS.next(BACKGROUND_COLOR_NOT_CLOSE);
    this.dialog.open(DialogNewDrawingComponent, { height: NEW_DRAWING_H, width: NEW_DRAWING_W });
  }
}
