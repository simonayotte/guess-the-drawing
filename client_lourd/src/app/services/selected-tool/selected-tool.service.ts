import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AbstractTool } from 'src/app/components/app/tools/abstract-tool';

@Injectable({
  providedIn: 'root'
})
export class SelectedToolService {
  selectedTool: AbstractTool;
  selectedToolBS: BehaviorSubject<AbstractTool>;

  constructor() {
    this.selectedToolBS = new BehaviorSubject(this.selectedTool);
  }
}
