import { Component } from '@angular/core';
import { ToolButton } from '../tool-button';
import { BUTTONS } from '../tool-buttons-list';

@Component({
  selector: 'app-tool-buttons',
  templateUrl: './tool-buttons.component.html',
  styleUrls: ['./tool-buttons.component.scss']
})
export class ToolButtonsComponent {

  buttons: ToolButton[] = BUTTONS;

}
