export class AltUpNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, AltUpNotImplementedError.prototype);
    }
}
