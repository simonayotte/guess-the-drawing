export class DoubleClickNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, DoubleClickNotImplementedError.prototype);
    }
}
