export class MouseMoveNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, MouseMoveNotImplementedError.prototype);
    }
}
