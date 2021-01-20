import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOOL_BAR_WIDTH = 120;

@Injectable({
  providedIn: 'root',
})

export class DrawingSizeService {
    width: number;
    height: number;
    widthBS: BehaviorSubject<number>;
    heightBS: BehaviorSubject<number>;
    private userWantsMaxSize: boolean;
    private newDrawingCreated: boolean;
    constructor() {
        this.newDrawingCreated = false;
        this.userWantsMaxSize = true;
        this.widthBS = new BehaviorSubject(this.width);
        this.heightBS = new BehaviorSubject(this.height);
        this.setValuesToDefault();
    }
    setValuesToDefault(): void {
        this.heightBS.next(window.innerHeight);
        this.widthBS.next(window.innerWidth - TOOL_BAR_WIDTH);
        this.newDrawingCreated = false;
        this.userWantsMaxSize = true;
    }
    updateWidth(input: number): boolean {
        const valueWillChange = this.isValidInput(input);
        if (valueWillChange) {
            this.widthBS.next(input);
            if (!this.newDrawingCreated) {
                this.userWantsMaxSize = false;
            }
        }
        return valueWillChange;
    }
    updateHeight(input: number): boolean {
        const valueWillChange = this.isValidInput(input);
        if (valueWillChange) {
            this.heightBS.next(input);
            if (!this.newDrawingCreated) {
                this.userWantsMaxSize = false;
            }
        }
        return valueWillChange;
    }
    isValidInput(input: number): boolean {
        return !(isNaN(Number(input)) || input < 0 || !(input) || (input % 1) !== 0);
    }
    getUserWantsMaxSize(): boolean {
        return this.userWantsMaxSize;
    }
    newDrawing(): void {
        this.newDrawingCreated = true;
    }
}
