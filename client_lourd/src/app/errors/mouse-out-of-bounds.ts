export class MouseOutOfBoundsError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, MouseOutOfBoundsError.prototype);
    }
}
