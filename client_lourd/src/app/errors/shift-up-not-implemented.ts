export class ShiftUpNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ShiftUpNotImplementedError.prototype);
    }
}
