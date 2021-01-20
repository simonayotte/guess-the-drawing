export class RightMouseDownInElementNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, RightMouseDownInElementNotImplementedError.prototype);
    }
}
