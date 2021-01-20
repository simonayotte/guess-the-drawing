import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { ColorPickerService } from '../../../../services/color-picker/color-picker.service';
import { SelectedColorsService } from '../../../../services/color-picker/selected-colors.service';
import { Color } from './color';
import { COLORS } from './constants';

const R_ATTRIBUTE = 'r';
const G_ATTRIBUTE = 'g';
const B_ATTRIBUTE = 'b';
const HEX_ATTRIBUTE = 'h';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit, AfterViewInit {
  isValid: boolean;
  isValidR: boolean;
  isValidG: boolean;
  isValidB: boolean;
  isValidA: boolean;
  isValidHex: boolean;
  @Output() drawingCanBeCreated: EventEmitter<boolean>;

  color: Color;

  @ViewChild(R_ATTRIBUTE, {static: true})
  rInput: ElementRef<HTMLInputElement>;

  @ViewChild(G_ATTRIBUTE, {static: true})
  gInput: ElementRef<HTMLInputElement>;

  @ViewChild(B_ATTRIBUTE, {static: true})
  bInput: ElementRef<HTMLInputElement>;

  @ViewChild(HEX_ATTRIBUTE, {static: true})
  hInput: ElementRef<HTMLInputElement>;

  constructor(private colorPickerService: ColorPickerService,
              public selectedColorsService: SelectedColorsService,
              private ref: ChangeDetectorRef, private continueDrawingService: ContinueDrawingService) {
                this.drawingCanBeCreated = new EventEmitter<boolean>();
              }

  ngOnInit(): void {
    this.colorPickerService.density.subscribe((result) => {
      if (this.color) {
        this.color = new Color(result.getR(), result.getG(), result.getB(), this.color.getA());
        this.isValidR = true;
        this.isValidG = true;
        this.isValidB = true;
        this.isValidA = true;
        this.isValidHex = true;
        this.validateInput();
      } else {
        this.color = result;
      }
    });
  }

  ngAfterViewInit(): void {
    this.color = COLORS.WHITE.clone();
    this.colorPickerService.color.next(this.color);
    this.ref.detectChanges();
  }

  changeColor(value: string, attribute: string): void {
    this.validateColor(value, attribute);
    const colorValue = Math.round(+value);
    switch (attribute) {
      case R_ATTRIBUTE: {
        if (this.isValidR) {
          this.color.setR(colorValue);
          this.refreshAllInputs(this.color);
        }
        break;
      }
      case G_ATTRIBUTE: {
        if (this.isValidG) {
          this.color.setG(colorValue);
          this.refreshAllInputs(this.color);
        }
        break;
      }
      case B_ATTRIBUTE: {
        if (this.isValidB) {
          this.color.setB(colorValue);
          this.refreshAllInputs(this.color);
        }
        break;
      }
    }
    if (this.isValid) {
      this.colorPickerService.color.next(this.color);
    }
  }

  changeAlpha(value: string): void {
    this.validateAlpha(value);
    if (this.isValidA) {
      this.color.setA(+value);
      this.colorPickerService.color.next(this.color);
      this.refreshAllInputs(this.color);
    }
  }

  changeHex(value: string): void {
    this.validateHex(value);
    if (this.isValidHex) {
      this.color.setRGBFromHex(value);
      this.colorPickerService.color.next(this.color);
      this.refreshAllInputs(this.color);
    }
  }

  selectedValue(): void {
    this.selectedColorsService.setColor(this.color);
    if (this.continueDrawingService.isDrawingInLocalStorage()) {
      this.continueDrawingService.autoSaveDrawing();
    }
    this.drawingCanBeCreated.emit(true);
  }

  validateColor(value: string, attribute: string): void {
    const valid = this.colorPickerService.isValidNumericValue(value, Color.MIN_COLOR, Color.MAX_COLOR, false);
    switch (attribute) {
      case R_ATTRIBUTE: { this.isValidR = valid; this.isValidHex = this.isValidHex || this.isValidR; break; }
      case G_ATTRIBUTE: { this.isValidG = valid; this.isValidHex = this.isValidHex || this.isValidG; break; }
      case B_ATTRIBUTE: { this.isValidB = valid; this.isValidHex = this.isValidHex || this.isValidB; break; }
    }

    this.validateInput();
  }

  validateAlpha(value: string): void {
    this.isValidA = this.colorPickerService.isValidNumericValue(value, Color.MIN_ALPHA, Color.MAX_ALPHA, true);
    this.validateInput();
  }

  validateHex(value: string): void {
    const valid = this.colorPickerService.isValidHexValue(value);
    this.isValidHex = valid;
    if (valid) {
      this.isValidR = valid;
      this.isValidG = valid;
      this.isValidB = valid;
    }
    this.validateInput();
  }

  validateInput(): void {
    this.isValid = this.isValidR && this.isValidG && this.isValidB && this.isValidA && this.isValidHex;
    if (!this.isValid) {
      this.drawingCanBeCreated.emit(false);
    }
  }

  refreshAllInputs(color: Color): void {
    if (this.isValidR) { this.rInput.nativeElement.value = color.getR().toString(); }
    if (this.isValidG) { this.gInput.nativeElement.value = color.getG().toString(); }
    if (this.isValidB) { this.bInput.nativeElement.value = color.getB().toString(); }
    if (this.isValidHex) { this.hInput.nativeElement.value = color.strFormatHex(); }
  }
}
