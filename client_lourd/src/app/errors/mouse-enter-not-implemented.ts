export class MouseEnterNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, MouseEnterNotImplementedError.prototype);
    }
}
