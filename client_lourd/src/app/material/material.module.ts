import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';

const material = [
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatTreeModule,
  MatExpansionModule,
  MatChipsModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule
];

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
