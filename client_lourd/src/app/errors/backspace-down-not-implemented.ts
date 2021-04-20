export class BackspaceDownNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, BackspaceDownNotImplementedError.prototype);
    }
}
