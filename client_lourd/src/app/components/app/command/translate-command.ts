import { Renderer2 } from '@angular/core';
import { SelectionManipulationService } from 'src/app/services/tools/selection-manipulation/selection-manipulation.service';
import { AbsCommand, IHash } from './abs-command';

const REFRESH_TRANSFORM = 'refreshTransform';

export class TranslateCommand extends AbsCommand {
    private selectedElements: SVGPathElement[];
    private transformCommand: string;
    private renderer: Renderer2;
    private translate: [number, number];
    private selectionManipulation: SelectionManipulationService;
    constructor(selectedElements: SVGPathElement[], transformCommand: string, translate: [number, number],
                selectionManipulation: SelectionManipulationService) {
        super();
        this.selectedElements = selectedElements;
        this.transformCommand = transformCommand;
        this.selectionManipulation = selectionManipulation;
        this.translate = translate;
    }

    initializeRenderer(renderer: Renderer2): void {
        this.renderer = renderer;
    }

    execute(callBackMap: IHash): void {
        for (const element of this.selectedElements) {
            let transformString = '' + element.getAttribute('transform');
            transformString = this.selectionManipulation.deleteLastRotate(transformString);
            this.renderer.setAttribute(element, 'transform', transformString + this.transformCommand);
            this.selectionManipulation.updateRotation(element);
        }
        callBackMap[REFRESH_TRANSFORM](this.selectedElements, this.translate);
    }
    cancel(callBackMap: IHash): void {
        const REVERT_FACTOR = -1;
        for (const element of this.selectedElements) {
            let transformString = '' + element.getAttribute('transform');
            transformString = transformString.substring(0, transformString.lastIndexOf('translate'));
            transformString = this.selectionManipulation.deleteLastRotate(transformString);
            this.renderer.setAttribute(element, 'transform', transformString);
            this.selectionManipulation.updateRotation(element);
        }
        callBackMap[REFRESH_TRANSFORM](this.selectedElements, [this.translate[0] * REVERT_FACTOR, this.translate[1] * REVERT_FACTOR]);
    }
}
