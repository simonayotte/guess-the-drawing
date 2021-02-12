import { DrawCommand } from '../../components/app/command/draw-command';
import { CommandInvokerService} from './command-invoker.service';


describe('CommandInvokerServiceService', () => {
  let cmd: DrawCommand;
  let service: CommandInvokerService;

  beforeEach(() => {
    const PATH: SVGPathElement = {} as SVGPathElement;
    cmd = new DrawCommand(PATH);
    service = new CommandInvokerService();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('execute should call cmd.execute and if is not undefined should push and clearUndone stack', () => {
    const SPY_ON_COMMAND = spyOn(cmd, 'execute');
    const pushSpyOn = spyOn(service.commandDoneStack, 'push');
    service.execute(cmd);
    expect(SPY_ON_COMMAND).toHaveBeenCalled();
    expect(pushSpyOn).toHaveBeenCalledWith(cmd);
    expect(service.commandUndoneStack.length).toBe(0);
  });
  it('new drawing should clear all stacks', () => {
    service.commandDoneStack.push(cmd);
    service.commandUndoneStack.push(cmd);
    service.newDrawing();
    expect(service.commandDoneStack.length).toBe(0);
    expect(service.commandUndoneStack.length).toBe(0);
  });
  it('redo should execute command if undone stack is not empty and last undone command is not undefined', () => {
    service.commandUndoneStack.push(cmd);
    const SPY_ON_POP = spyOn(service.commandUndoneStack, 'pop').and.returnValue(cmd);
    const SPY_ON_PUSH = spyOn(service.commandDoneStack, 'push');
    const SPY_ON_COMMAND = spyOn(cmd, 'execute');
    service.redo();
    expect(SPY_ON_POP).toHaveBeenCalled();
    expect(SPY_ON_COMMAND).toHaveBeenCalled();
    expect(SPY_ON_PUSH).toHaveBeenCalledWith(cmd);
  });
  it('undo should call cancel  and push the lastCommand to undone Stack', () => {
    service.commandDoneStack.push(cmd);
    const SPY_ON_POP = spyOn(service.commandDoneStack, 'pop').and.returnValue(cmd);
    const SPY_ON_PUSH = spyOn(service.commandUndoneStack, 'push');
    const SPY_ON_COMMAND = spyOn(cmd, 'cancel');

    service.undo();
    expect(SPY_ON_POP).toHaveBeenCalled();
    expect(SPY_ON_COMMAND).toHaveBeenCalled();
    expect(SPY_ON_PUSH).toHaveBeenCalledWith(cmd);
  });
  it('redo and undo should do nothing if respective stack are empty', () => {
    const SPY_ON_POP_UNDONE = spyOn(service.commandUndoneStack, 'pop');
    const SPY_ON_POP_DONE = spyOn(service.commandDoneStack, 'pop');

    service.redo();
    service.undo();
    expect(SPY_ON_POP_DONE).not.toHaveBeenCalled();
    expect(SPY_ON_POP_UNDONE).not.toHaveBeenCalled();
  });
  it('should do nothing if the command is undefined', () => {
    service.commandDoneStack.push(cmd);
    service.commandUndoneStack.push(cmd);
    spyOn(service.commandDoneStack, 'pop').and.returnValue(undefined);
    spyOn(service.commandUndoneStack, 'pop').and.returnValue(undefined);
    const SPY_ON_COMMAND_EXECUTE = spyOn(cmd, 'execute');
    const SPY_ON_COMMAND_CANCEL = spyOn(cmd, 'cancel');
    service.undo();
    service.redo();
    expect(SPY_ON_COMMAND_CANCEL).not.toHaveBeenCalled();
    expect(SPY_ON_COMMAND_EXECUTE).not.toHaveBeenCalled();
  });
});
