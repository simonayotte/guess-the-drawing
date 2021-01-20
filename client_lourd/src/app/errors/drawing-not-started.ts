export class DrawingNotStartedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, DrawingNotStartedError.prototype);
    }
}
