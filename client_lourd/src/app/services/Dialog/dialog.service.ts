import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerComponent } from '../../components/app/tools/color-picker/color-picker.component';
import { SelectedColorsService } from '../color-picker/selected-colors.service';

const DIALOG_W = '400px';
const DIALOG_H = '500px';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dismiss: boolean;

  constructor(public dialog: MatDialog,
              private selectedColorsService: SelectedColorsService
              ) {
  }


  openColorPicker(selectedColorChange: number): void {
    this.selectedColorsService.selectColorChangeBS.next(selectedColorChange);
    this.dialog.open(ColorPickerComponent, { height: DIALOG_H, width: DIALOG_W });
  }

  hasOpenDialog(): boolean {
    return this.dialog.openDialogs.length !== 0;
  }

}
