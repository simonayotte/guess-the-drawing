import { AbsCommand , IHash } from './abs-command';

const APPEND_CHILD_CALLBACK = 'appendChildFunction';
const REMOVE_CHILD_CALLBACK = 'removeChildFunction';

export class DrawCommand extends AbsCommand {
    svgPath: SVGPathElement;

    constructor(svgPath: SVGPathElement) {
        super();
        this.svgPath = svgPath;
    }
    execute(callBackMap: IHash): void {
        callBackMap[APPEND_CHILD_CALLBACK](this.svgPath);
    }
    cancel(callBackMap: IHash): void {
        callBackMap[REMOVE_CHILD_CALLBACK](this.svgPath);
    }
}
