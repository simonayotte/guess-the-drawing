import { CutCommand } from './cut-command';
export interface IHash {
  // We disabled this rule since its a callback with zero or multiple parameters which has no type
  // tslint:disable-next-line: no-any
  [details: string]: any;
}
describe('CutCommand', () => {
  const path: SVGPathElement = {} as SVGPathElement;
  const paths = [path, path, path];
  const command = new CutCommand(paths);
  it('should create an instance', () => {
    expect(new CutCommand(paths)).toBeTruthy();
  });
  it('execute should call remove child on every path in the array', () => {
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
