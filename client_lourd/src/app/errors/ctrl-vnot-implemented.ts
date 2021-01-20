export class CtrlVNotImplemented extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, CtrlVNotImplemented.prototype);
    }
}
