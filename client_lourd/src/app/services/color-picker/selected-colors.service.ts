import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from '../../components/app/tools/color-picker/color';

// same as Android
const DEFAULT_COLORS = [new Color(1,1,1,1), new Color(0,0,0,0.5), new Color(255, 152, 0, 1),
  new Color(255, 235, 59, 1), new Color(76, 175, 80, 1), new Color(0, 188, 212, 1),
  new Color(63, 81, 181, 1), new Color(156, 39, 176, 1), new Color(244, 67, 54, 1)];
@Injectable({
  providedIn: 'root'
})
export class SelectedColorsService {
  colorSelectedBS: BehaviorSubject<Color[]>;
  primaryColorBS: BehaviorSubject<Color>;
  colorSelected: Color[] = [];

  constructor() {
    this.colorSelected = DEFAULT_COLORS;
    this.colorSelectedBS = new BehaviorSubject(this.colorSelected);
    this.primaryColorBS = new BehaviorSubject(this.colorSelected[0]);
  }

  updatePreviousColors(): void {
    this.newColorSelected(this.primaryColorBS.value);
  }

  setColor(color: Color, updatePreviousColors: boolean = true, keepOpacity: boolean = false): void {
    const newOpacity = keepOpacity ? this.primaryColorBS.value.getA() : color.getA();
    const newColor = new Color(color.getR(), color.getG(), color.getB(), newOpacity);
    this.primaryColorBS.next(newColor);
    if (updatePreviousColors) {
     this.newColorSelected(newColor);
    }
  }

  private findColor(newColor: Color): number {
    for (let i = 0; i < DEFAULT_COLORS.length; i++) {
      if (this.colorSelected[i].getR() === newColor.getR() && this.colorSelected[i].getG() === newColor.getG() &&
        this.colorSelected[i].getB() === newColor.getB() && this.colorSelected[i].getA() === newColor.getA() ) {
          return i;
      }
    }
    return -1;
  }

  private newColorSelected(newColor: Color): void {
    const idColor = this.findColor(newColor);
    if(idColor === 0){
      return;
    }
    if (idColor === -1) {
      this.colorSelected.pop();
    } else {
      this.colorSelected.splice(idColor, 1);
    }
    this.colorSelected.unshift(newColor.clone());
    this.colorSelectedBS.next(this.colorSelected);
  }

  reUseColor(index: number, event: MouseEvent): void {
    this.setColor(this.colorSelected[index]);
  }

}
