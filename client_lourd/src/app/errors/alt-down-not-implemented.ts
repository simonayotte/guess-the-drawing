export class AltDownNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, AltDownNotImplementedError.prototype);
    }
}
