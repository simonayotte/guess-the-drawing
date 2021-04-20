import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerComponent } from '../../components/app/tools/color-picker/color-picker.component';

const DIALOG_W = '400px';
const DIALOG_H = '500px';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dismiss: boolean;

  constructor(public dialog: MatDialog) {
  }


  openColorPicker(selectedColorChange: number): void {
    this.dialog.open(ColorPickerComponent, { height: DIALOG_H, width: DIALOG_W });
  }

  hasOpenDialog(): boolean {
    return this.dialog.openDialogs.length !== 0;
  }

}
