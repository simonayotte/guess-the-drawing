export class ScreenWitdhIsUndefinedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ScreenWitdhIsUndefinedError.prototype);
    }
}
