import { Renderer2 } from '@angular/core';
import { SelectionManipulationService } from 'src/app/services/tools/selection-manipulation/selection-manipulation.service';
import { AbsCommand } from './abs-command';

export interface IHash {
    // We disabled this rule since its a callback with zero or multiple parameters which has no type
    // tslint:disable-next-line: no-any
    [details: string]: any;
}
export class RotateCommand extends AbsCommand {

    private selectedElements: SVGPathElement[];
    private selectionCenteredRotation: boolean;
    private renderer: Renderer2;
    private rotationAngle: number;
    private selectionManipulationService: SelectionManipulationService;
    private selectionCenteredCallback: (angle: number, selectedElements: SVGPathElement[]) => void;

    constructor(selectedElements: SVGPathElement[], selectionCenteredRotation: boolean, rotationAngle: number,
                selectionManipulationService: SelectionManipulationService,
                selectionCenteredCallback: (angle: number, selectedElements: SVGPathElement[]) => void) {
        super();
        this.selectedElements = selectedElements;
        this.selectionCenteredRotation = selectionCenteredRotation;
        this.rotationAngle = rotationAngle;
        this.selectionManipulationService = selectionManipulationService;
        this.selectionCenteredCallback = selectionCenteredCallback;
    }

    initializeRenderer(renderer: Renderer2): void {
        this.renderer = renderer;
    }

    execute(callBackMap: IHash): void {
        if (this.selectionCenteredRotation) {
            this.selectionCenteredCallback(this.rotationAngle, this.selectedElements);
        } else {
            for (const element of this.selectedElements) {
            const rotationAngle =  element.getAttribute('rotationAngle');
            if (rotationAngle) {
                this.renderer.setAttribute(element, 'rotationAngle', (+rotationAngle + this.rotationAngle).toString());
            }
            this.selectionManipulationService.updateRotation(element);
            }
        }
    }

    private deleteLastTranslateAndRotate(element: SVGPathElement): void {
        let transformString = element.getAttribute('transform');
        if (transformString) {
            transformString = this.selectionManipulationService.deleteLastRotate(transformString);
            transformString = transformString.substring(0, transformString.lastIndexOf('translate'));
            this.renderer.setAttribute(element, 'transform', transformString);
        }
    }

    cancel(callBackMap: IHash): void {
        for (const element of this.selectedElements) {
            const rotationAngle =  element.getAttribute('rotationAngle');
            if (rotationAngle) {
                this.renderer.setAttribute(element, 'rotationAngle', (+rotationAngle - this.rotationAngle).toString());
            }
            if (this.selectionCenteredRotation) {
                this.deleteLastTranslateAndRotate(element);
            }
            this.selectionManipulationService.updateRotation(element);
        }
    }
}
