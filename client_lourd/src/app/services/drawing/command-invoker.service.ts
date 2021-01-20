import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AbsCommand } from '../../components/app/command/abs-command';
import { ContinueDrawingService } from '../continue-drawing/continue-drawing.service';

const APPEND_CHILD_CALLBACK = 'appendChildFunction';
const REMOVE_CHILD_CALLBACK = 'removeChildFunction';
const REFRESH_TRANSFORM = 'refreshTransform';

export interface IHash {
  // We disabled this rule because we didnt find any type for a callback with 0 or multiple arguments
  // tslint:disable-next-line: no-any
  [details: string]: any;
}
@Injectable({
  providedIn: 'root'
})
export class CommandInvokerService {
  commandDoneStack: AbsCommand [] = [];
  commandUndoneStack: AbsCommand [] = [];
  callBackMap: IHash = {};
  displayStatusUndoRedoBtn: BehaviorSubject<[boolean, boolean]>;

  constructor(private continueDrawingService: ContinueDrawingService) {
    this.displayStatusUndoRedoBtn = new BehaviorSubject([false, false]);
  }
  // I disable the no-any rule since we are passing callback, which can have zero or multiple parameters, as parameters of the functions
  /* tslint:disable */
  defineCallBackFunction(appendChildFunction: any, removeChildFunction: any): void {
    this.callBackMap[APPEND_CHILD_CALLBACK] = appendChildFunction;
    this.callBackMap[REMOVE_CHILD_CALLBACK] = removeChildFunction;
  }
  defineEraserCallBack(refreshTransform: any): void {
    this.callBackMap[REFRESH_TRANSFORM] = refreshTransform;
  }
  /* tslint:enable */
  execute(cmd: AbsCommand): void {
    cmd.execute(this.callBackMap);
    this.commandDoneStack.push(cmd);
    this.commandUndoneStack = [];
    this.refreshDisplayButtonValues();
  }
  undo(): void {
    if (this.commandDoneStack.length !== 0 ) {
      const lastCommand = this.commandDoneStack.pop();
      if (typeof lastCommand !== 'undefined') {
        lastCommand.cancel(this.callBackMap);
        this.commandUndoneStack.push(lastCommand);
      }
      this.refreshDisplayButtonValues();
    }
    this.continueDrawingService.autoSaveDrawing();
  }
  redo(): void {
    if (this.commandUndoneStack.length !== 0) {
      const lastUnDoneCommand = this.commandUndoneStack.pop();
      if (typeof lastUnDoneCommand !== 'undefined') {
        lastUnDoneCommand.execute(this.callBackMap);
        this.commandDoneStack.push(lastUnDoneCommand);
      }
      this.refreshDisplayButtonValues();
    }
    this.continueDrawingService.autoSaveDrawing();
  }
  addCommand(cmd: AbsCommand): void {
    this.commandDoneStack.push(cmd);
    this.commandUndoneStack = [];
    this.refreshDisplayButtonValues();
  }
  newDrawing(): void {
    this.commandDoneStack = [];
    this.commandUndoneStack = [];
    this.refreshDisplayButtonValues();
  }
  private refreshDisplayButtonValues(): void {
    this.displayStatusUndoRedoBtn.next([this.hasDoneCommand(), this.hasUnDoneCommand()]);
  }
  private hasDoneCommand(): boolean {
    return this.commandDoneStack.length !== 0;
  }
  private hasUnDoneCommand(): boolean {
    return this.commandUndoneStack.length !== 0;
  }
}
