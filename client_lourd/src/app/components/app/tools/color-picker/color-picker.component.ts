import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColorPickerService } from '../../../../services/color-picker/color-picker.service';
import { SelectedColorsService } from '../../../../services/color-picker/selected-colors.service';
import { Color } from './color';
import { COLORS } from './constants';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit, AfterViewInit {
  color: Color;

  constructor(private colorPickerService: ColorPickerService,
              public selectedColorsService: SelectedColorsService,
              private ref: ChangeDetectorRef) {
              }

  ngOnInit(): void {
    this.colorPickerService.density.subscribe((result) => {
      if (this.color) {
        this.color = new Color(result.getR(), result.getG(), result.getB(), this.color.getA());
      } else {
        this.color = result;
      }
      this.selectedColorsService.setColor(this.color, false, true);
    });
    this.selectedColorsService.primaryColorBS.subscribe((result) => {
      if(this.color.getR() !== result.getR() || this.color.getB() !== result.getB()
      || this.color.getG() !== result.getG()) {
        this.color = new Color(result.getR(), result.getG(), result.getB(), this.color.getA());
        this.colorPickerService.color.next(this.color);
      }
    });
  }

  ngAfterViewInit(): void {
    this.color = COLORS.BLACK.clone();
    this.colorPickerService.color.next(this.color);
    this.ref.detectChanges();
  }
}
