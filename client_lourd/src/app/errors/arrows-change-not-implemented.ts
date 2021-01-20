export class ArrowsChangeNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ArrowsChangeNotImplementedError.prototype);
    }
}
