import { AbsCommand, IHash } from './abs-command';
const APPEND_CHILD_CALLBACK = 'appendChildFunction';
const REMOVE_CHILD_CALLBACK = 'removeChildFunction';
export class PasteCommand extends AbsCommand {
    svgPaths: SVGPathElement[] = [];
    translate: [number, number];
    constructor(svgPath: SVGPathElement[], shiftValue: number) {
        super();
        this.svgPaths = svgPath;
        this.translate = [shiftValue, shiftValue];
    }
    execute(callBackMap: IHash): void {
        for (const path of this.svgPaths) {
            callBackMap[APPEND_CHILD_CALLBACK](path);
        }
    }
    cancel(callBackMap: IHash): void {
        for (const path of this.svgPaths) {
            callBackMap[REMOVE_CHILD_CALLBACK](path);
        }
    }
}
