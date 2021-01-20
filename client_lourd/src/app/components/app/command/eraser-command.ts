import { AbsCommand, IHash } from './abs-command';

const APPEND_CHILD_CALLBACK = 'appendChildFunction';
const REMOVE_CHILD_CALLBACK = 'removeChildFunction';

export class EraserCommand extends AbsCommand {
    svgPaths: SVGPathElement[];

    constructor(svgPath: SVGPathElement[]) {
        super();
        this.svgPaths = svgPath;
    }

    execute(callBackMap: IHash): void {
        for (const path of this.svgPaths) {
            callBackMap[REMOVE_CHILD_CALLBACK](path);
        }
    }
    cancel(callBackMap: IHash): void {
        for (const path of this.svgPaths) {
            callBackMap[APPEND_CHILD_CALLBACK](path);
        }
    }
}
