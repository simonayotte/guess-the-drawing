import { ScrollService } from 'src/app/services/scroll-Service/scroll.service';
import { SelectionManipulationService } from 'src/app/services/tools/selection-manipulation/selection-manipulation.service';
import { TranslateCommand } from './translate-command';

const SELECTED_ELEMENTS = 'selectedElements';
const SELECTION_MANIPULATION_SERVICE = 'selectionManipulation';
const REFRESH_TRANSFORM = 'refreshTransform';
const RENDERER = 'renderer';

export interface IHash {
  // We disabled this rule since its a callback with zero or multiple parameters which has no type
  // tslint:disable-next-line: no-any
  [details: string]: any;
}
describe('TranslateCommand', () => {
  const translateX = -10;
  const translateY = 10;
  const selectionManipulationService = new SelectionManipulationService(new ScrollService());
  const command = new TranslateCommand([], 'test', [translateX, translateY], selectionManipulationService);
  it('should create an instance', () => {
    expect(command).toBeTruthy();
  });

  it('execute should call getAttribute on each selectedElements and setAttribute for each selected elements', () => {
    const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
    command[SELECTED_ELEMENTS] = [mockPath, mockPath];
    command[RENDERER] = jasmine.createSpyObj('renderer', ['setAttribute']);
    const CALL_BACK_MAP = {} as IHash;
    spyOn(command[SELECTION_MANIPULATION_SERVICE], 'updateRotation');
    CALL_BACK_MAP[REFRESH_TRANSFORM] = jasmine.createSpy().and.callFake(() => {return; });
    command.execute(CALL_BACK_MAP);
    expect(mockPath.getAttribute).toHaveBeenCalledTimes(2);
    expect(command[RENDERER].setAttribute).toHaveBeenCalledTimes(2);
  });

  it('cancel should call getAttribute on each selectedElements and setAttribute for each selected elements', () => {
    command[RENDERER] = jasmine.createSpyObj('renderer', ['setAttribute']);
    const mockCancelPath = jasmine.createSpyObj('path', ['getAttribute']);
    const CALL_BACK_MAP = {} as IHash;
    command[SELECTED_ELEMENTS] = [mockCancelPath, mockCancelPath];
    CALL_BACK_MAP[REFRESH_TRANSFORM] = jasmine.createSpy().and.callFake(() => {return; });
    spyOn(command[SELECTION_MANIPULATION_SERVICE], 'updateRotation');
    command.cancel(CALL_BACK_MAP);
    expect(mockCancelPath.getAttribute).toHaveBeenCalledTimes(2);
    expect(command[RENDERER].setAttribute).toHaveBeenCalledTimes(2);
  });
  it('initializerenderer should set the value the of the renderer as the renderer passed in parameters', () => {
    const mockRenderer = jasmine.createSpyObj('renderer', ['setAttribute']);
    command.initializeRenderer(mockRenderer);
    expect(command[RENDERER]).toBe(mockRenderer);
  });
});
