import { Component } from '@angular/core';
import { SelectedColorsService } from '../../../../services/color-picker/selected-colors.service';

const MAX_ITERATION_COLOR = 10;

@Component({
  selector: 'app-last-selected-colors',
  templateUrl: './last-selected-colors.component.html',
  styleUrls: ['./last-selected-colors.component.scss']
})
export class LastSelectedColorsComponent {
  color: string[] = [];
  lastColors: string [] = [];
  constructor(private selectedColorsService: SelectedColorsService) {
    this.selectedColorsService.colorSelectedBS.subscribe((result) => {
      for (let i = 0; i < MAX_ITERATION_COLOR; i++) {
        this.color[i] = result[i].strFormat();
      }
    });
  }
  reUseColor(index: number, event: MouseEvent): void {
    event.preventDefault();
    this.selectedColorsService.reUseColor(index, event);
  }
}
