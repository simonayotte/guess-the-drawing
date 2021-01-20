import { AbsCommand , IHash } from './abs-command';
const APPEND_CHILD_CALLBACK = 'appendChildFunction';
const REMOVE_CHILD_CALLBACK = 'removeChildFunction';
export class CutCommand extends AbsCommand {
    private paths: SVGPathElement[];
    constructor(svgPath: SVGPathElement[]) {
        super();
        this.paths = svgPath;
    }
    execute(callBackMap: IHash): void {
        for (const path of this.paths) {
            callBackMap[REMOVE_CHILD_CALLBACK](path);
        }
    }
    cancel(callBackMap: IHash): void {
        for (const path of this.paths) {
            callBackMap[APPEND_CHILD_CALLBACK](path);
        }
    }
}
