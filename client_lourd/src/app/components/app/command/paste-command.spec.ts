import { PasteCommand } from './paste-command';
export interface IHash {
  // We disabled this rule since its a callback with zero or multiple parameters which has no type
  // tslint:disable-next-line: no-any
  [details: string]: any;
}
const APPEND_CHILD_CALLBACK = 'appendChildFunction';
const REMOVE_CHILD_CALLBACK = 'removeChildFunction';
describe('PasteCommand', () => {
  const shiftValue = 0;
  const path: SVGPathElement = {} as SVGPathElement;
  const paths: SVGPathElement[] = [path, path, path];
  const command = new PasteCommand(paths, shiftValue);
  it('should create an instance', () => {
    expect(new PasteCommand(paths, shiftValue)).toBeTruthy();
  });
  it('execute should call append on each path in command', () => {
    const length = 3;
    const CALL_BACK_MAP = {} as IHash;
    CALL_BACK_MAP[APPEND_CHILD_CALLBACK] = jasmine.createSpy().and.callFake(() => {return; });
    command.execute(CALL_BACK_MAP);
    expect(CALL_BACK_MAP[APPEND_CHILD_CALLBACK]).toHaveBeenCalledTimes(length);
  });
  it('cancel should call remove on each path in command', () => {
    const length = 3;
    const CALL_BACK_MAP = {} as IHash;
    CALL_BACK_MAP[REMOVE_CHILD_CALLBACK] = jasmine.createSpy().and.callFake(() => {return; });
    command.cancel(CALL_BACK_MAP);
    expect(CALL_BACK_MAP[REMOVE_CHILD_CALLBACK]).toHaveBeenCalledTimes(length);
  });
});
