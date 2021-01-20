export class MouseClickNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, MouseClickNotImplementedError.prototype);
    }
}
