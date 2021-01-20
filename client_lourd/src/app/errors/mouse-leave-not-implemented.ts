export class MouseLeaveNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, MouseLeaveNotImplementedError.prototype);
    }
}
