export class MouseDownNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, MouseDownNotImplementedError.prototype);
    }
}
