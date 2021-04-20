export class MouseUpNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, MouseUpNotImplementedError.prototype);
    }
}
