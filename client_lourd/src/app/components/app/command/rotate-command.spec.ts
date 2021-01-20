import { ScrollService } from 'src/app/services/scroll-Service/scroll.service';
import { SelectionManipulationService } from 'src/app/services/tools/selection-manipulation/selection-manipulation.service';
import { RotateCommand } from './rotate-command';

const RENDERER = 'renderer';
const DELETE_LAST_TRANSLATE_AND_ROTATE = 'deleteLastTranslateAndRotate';
const SELECTION_CENTERED_CALLBACK = 'selectionCenteredCallback';
const SELECTION_CENTERED_ROTATION = 'selectionCenteredRotation';
const SELECTED_ELEMENTS = 'selectedElements';

export interface IHash {
    // We disabled this rule since its a callback with zero or multiple parameters which has no type
    // tslint:disable-next-line: no-any
    [details: string]: any;
  }
describe('RotateCommand', () => {
    const scrollService = new ScrollService();
    const selectionManipulationService = new SelectionManipulationService(scrollService);
    const command = new RotateCommand([], true, 0, selectionManipulationService, () => {return; });

    beforeEach(() => {
        command[RENDERER] = jasmine.createSpyObj('renderer', ['setAttribute']);
    });

    it('should create an instance', () => {
      expect(command).toBeTruthy();
    });

    it('initializerenderer should set the value the of the renderer as the renderer passed in parameters', () => {
        const mockRenderer = jasmine.createSpyObj('renderer', ['setAttribute']);
        command.initializeRenderer(mockRenderer);
        expect(command[RENDERER]).toBe(mockRenderer);
    });

    it('deleteLastTranslateAndRotate should call deleteLastRotate and set the transformAttribute', () => {
        const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
        const mockTransform = 'test translate';
        command[RENDERER] = jasmine.createSpyObj('renderer', ['setAttribute']);
        mockPath.getAttribute.and.returnValue(mockTransform);
        spyOn(selectionManipulationService, 'deleteLastRotate').and.returnValue(mockTransform);
        command[DELETE_LAST_TRANSLATE_AND_ROTATE](mockPath as SVGPathElement);
        expect(selectionManipulationService.deleteLastRotate).toHaveBeenCalled();
        expect(command[RENDERER].setAttribute).toHaveBeenCalled();
    });

    it('deleteLastTranslateAndRotate should call getAttribute and not set the transformAttribute if the initial transform is null', () => {
        const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
        const mockTransform = null;
        command[RENDERER] = jasmine.createSpyObj('renderer', ['setAttribute']);
        mockPath.getAttribute.and.returnValue(mockTransform);
        command[DELETE_LAST_TRANSLATE_AND_ROTATE](mockPath as SVGPathElement);
        expect(command[RENDERER].setAttribute).toHaveBeenCalledTimes(0);
        expect(mockPath.getAttribute).toHaveBeenCalledTimes(1);
    });

    it('execute should call selectionCenteredCallback if its a selectionCenteredRotation', () => {
        // We disabled this rule to spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(command, 'selectionCenteredCallback');
        command[SELECTION_CENTERED_ROTATION] = true;
        command.execute({} as IHash);
        expect(command[SELECTION_CENTERED_CALLBACK]).toHaveBeenCalled();
    });

    it('execute should call getAttribute and updateRotationAngle for each selectedElements in a selfCenteredRotation', () => {
        const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
        command[SELECTION_CENTERED_ROTATION] = false;
        command[SELECTED_ELEMENTS] = [mockPath, mockPath];
        spyOn(selectionManipulationService, 'updateRotation');
        command.execute({} as IHash);
        expect(selectionManipulationService.updateRotation).toHaveBeenCalledTimes(2);
        expect(mockPath.getAttribute).toHaveBeenCalledTimes(2);
    });

    it('execute should call setAttribute for each selectedElements in a selfCenteredRotation to update the rotationAngle', () => {
        const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
        mockPath.getAttribute.and.returnValue(1);
        command[SELECTION_CENTERED_ROTATION] = false;
        command[SELECTED_ELEMENTS] = [mockPath, mockPath];
        command[RENDERER] = jasmine.createSpyObj('renderer', ['setAttribute']);
        spyOn(selectionManipulationService, 'updateRotation');
        command.execute({} as IHash);
        expect(command[RENDERER].setAttribute).toHaveBeenCalledTimes(2);
    });

    it('cancel should call getAttribute and updateRotation for each selected elements', () => {
        const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
        mockPath.getAttribute.and.returnValue(1);
        command[SELECTION_CENTERED_ROTATION] = false;
        command[SELECTED_ELEMENTS] = [mockPath, mockPath];
        spyOn(selectionManipulationService, 'updateRotation');
        command.cancel({} as IHash);
        expect(selectionManipulationService.updateRotation).toHaveBeenCalledTimes(2);
        expect(mockPath.getAttribute).toHaveBeenCalledTimes(2);
    });

    it('cancel should call deleteLastTranslateAndRotate for each selectedelements in a selectionCenteredRotation', () => {
        const mockPath = jasmine.createSpyObj('path', ['getAttribute']);
        command[SELECTION_CENTERED_ROTATION] = true;
        command[SELECTED_ELEMENTS] = [mockPath, mockPath];
        command[RENDERER] = jasmine.createSpyObj('renderer', ['setAttribute']);
        spyOn(selectionManipulationService, 'updateRotation');
        // We disabled this rule to spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(command, 'deleteLastTranslateAndRotate');
        command.cancel({} as IHash);
        expect(command[DELETE_LAST_TRANSLATE_AND_ROTATE]).toHaveBeenCalledTimes(2);
    });
});
