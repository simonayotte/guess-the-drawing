export class EscapeClickNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, EscapeClickNotImplementedError.prototype);
    }
}
