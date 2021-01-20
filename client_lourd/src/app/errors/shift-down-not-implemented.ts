export class ShiftDownNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ShiftDownNotImplementedError.prototype);
    }
}
