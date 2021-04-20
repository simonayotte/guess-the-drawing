import { DrawCommand } from './draw-command';
export interface IHash {
  // We disabled this rule since its a callback with zero or multiple parameters which has no type
  // tslint:disable-next-line: no-any
  [details: string]: any;
}
describe('DrawCommand', () => {
  const path: SVGPathElement = {} as SVGPathElement;
  const APPEND_CHILD_CALLBACK = 'appendChildFunction';
  const REMOVE_CHILD_CALLBACK = 'removeChildFunction';
  const command = new DrawCommand(path);
  it('should create an instance', () => {
    expect(new DrawCommand(path)).toBeTruthy();
  });
  it('execute should call appendChild', () => {
    const CALL_BACK_MAP = {} as IHash;
    CALL_BACK_MAP[APPEND_CHILD_CALLBACK] = jasmine.createSpy().and.callFake(() => {return; });
    command.execute(CALL_BACK_MAP);
    expect(CALL_BACK_MAP[APPEND_CHILD_CALLBACK]).toHaveBeenCalledWith(path);
  });
  it('cancel should call removeChild', () => {
    const CALL_BACK_MAP = {} as IHash;
    CALL_BACK_MAP[REMOVE_CHILD_CALLBACK] = jasmine.createSpy().and.callFake(() => {return; });
    command.cancel(CALL_BACK_MAP);
    expect(CALL_BACK_MAP[REMOVE_CHILD_CALLBACK]).toHaveBeenCalledWith(path);
  });
});
