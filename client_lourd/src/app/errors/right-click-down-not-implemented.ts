export class RightClickDownNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, RightClickDownNotImplementedError.prototype);
    }
}
