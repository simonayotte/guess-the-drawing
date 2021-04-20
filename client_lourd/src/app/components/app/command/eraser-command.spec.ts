import { EraserCommand } from './eraser-command';

export interface IHash {
  // We disabled this rule since its a callback with zero or multiple parameters which has no type
  // tslint:disable-next-line: no-any
  [details: string]: any;
}
describe('EraserCommand', () => {
  let paths: SVGPathElement[] = [];
  const path: SVGPathElement = {} as SVGPathElement;
  paths = [path, path, path];
  const command = new EraserCommand(paths);
  it('should create an instance', () => {
    expect(new EraserCommand(paths)).toBeTruthy();
  });
  it('execute should call REMOVE_CHILD on each path in command', () => {
    const length = 3;
    const CALL_BACK_MAP = {} as IHash;
    const REMOVE_CHILD_CALLBACK = 'removeChildFunction';
    CALL_BACK_MAP[REMOVE_CHILD_CALLBACK] = jasmine.createSpy().and.callFake(() => {return; });
    command.execute(CALL_BACK_MAP);
    expect(CALL_BACK_MAP[REMOVE_CHILD_CALLBACK]).toHaveBeenCalledTimes(length);
  });
  it('execute should call APPEND_CHILD on each path in command', () => {
    const length = 3;
    const CALL_BACK_MAP = {} as IHash;
    const APPEND_CHILD_CALLBACK = 'appendChildFunction';
    CALL_BACK_MAP[APPEND_CHILD_CALLBACK] = jasmine.createSpy().and.callFake(() => {return; });
    command.cancel(CALL_BACK_MAP);
    expect(CALL_BACK_MAP[APPEND_CHILD_CALLBACK]).toHaveBeenCalledTimes(length);
  });
});
