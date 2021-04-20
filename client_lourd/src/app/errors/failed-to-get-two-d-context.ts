export class FailedToGet2DContextError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, FailedToGet2DContextError.prototype);
    }
}
