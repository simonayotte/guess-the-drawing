import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from '../../components/app/tools/color-picker/color';

const GREY_RGB = 130;
const BLACK_R = 46;
const BLACK_G = 49;
const BLACK_B = 49;
const WHITE_RGB = 255;
const TRANSPARANCY = 1;
const GREY = new Color(GREY_RGB, GREY_RGB, GREY_RGB, TRANSPARANCY);
const BLACK = new Color(BLACK_R, BLACK_G, BLACK_B, TRANSPARANCY);
const WHITE = new Color(WHITE_RGB, WHITE_RGB, WHITE_RGB, TRANSPARANCY);
const MAX_LOOP_ITERATION = 9;
const PRIMARY_COLOR = 0;
const SECONDARY_COLOR = 1;
const BACKGROUND_COLOR = 2;
const BACKGROUND_COLOR_NOT_CLOSE = 3;
const LEFT_BUTTON = 0;
const RIGHT_BUTTON = 2;
@Injectable({
  providedIn: 'root'
})
export class SelectedColorsService {
  colorSelected: Color[] = [];
  colorSelectedBS: BehaviorSubject<Color[]>;
  primaryColorBS: BehaviorSubject<Color>;
  secondaryColorBS: BehaviorSubject<Color>;
  backgroundColorBS: BehaviorSubject<Color>;
  selectColorChangeBS: BehaviorSubject<number>;

  constructor() {

    for (let i = 0; i <= MAX_LOOP_ITERATION; i++) {
      this.colorSelected[i] = WHITE;
    }
    this.colorSelectedBS = new BehaviorSubject(this.colorSelected);
    this.primaryColorBS = new BehaviorSubject(BLACK);
    this.secondaryColorBS = new BehaviorSubject(GREY);
    this.backgroundColorBS = new BehaviorSubject(WHITE);
    this.selectColorChangeBS = new BehaviorSubject(1);
  }

  setColor(color: Color): void {
    switch (this.selectColorChangeBS.value) {
      case PRIMARY_COLOR: {
        this.primaryColorBS.next(color);
        break;
      }
      case SECONDARY_COLOR: {
        this.secondaryColorBS.next(color);
        break;
      }
      case BACKGROUND_COLOR_NOT_CLOSE:
      case BACKGROUND_COLOR: {
        this.backgroundColorBS.next(color);
        break;
      }
    }
    if (this.ifShouldAddNewColor(color)) {
     this.newColorSelected(color);
    }
  }

  private ifShouldAddNewColor(newColor: Color): boolean {
    for (let i = 0; i <= MAX_LOOP_ITERATION; i++) {
      if (this.colorSelected[i].getR() === newColor.getR() && this.colorSelected[i].getG() === newColor.getG() &&
        this.colorSelected[i].getB() === newColor.getB()) {
        return false;
      }
    }
    return true;
  }

  private newColorSelected(newColor: Color): void {
    if (this.ifShouldAddNewColor(newColor)) {
      this.colorSelected.pop();
    } else {
      const index = this.colorSelected.indexOf(newColor);
      this.colorSelected.splice(index, 1);
    }
    this.colorSelected.unshift(newColor);
    this.colorSelectedBS.next(this.colorSelected);
  }

  reUseColor(index: number, event: MouseEvent): void {
    if (event.button === LEFT_BUTTON) {
      this.selectColorChangeBS.next(PRIMARY_COLOR);
    } else if (event.button === RIGHT_BUTTON) {
      this.selectColorChangeBS.next(SECONDARY_COLOR);
    }
    this.setColor(this.colorSelected[index]);
  }

}
