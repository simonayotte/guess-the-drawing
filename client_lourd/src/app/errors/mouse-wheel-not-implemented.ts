export class MouseWheelNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, MouseWheelNotImplementedError.prototype);
    }
}
