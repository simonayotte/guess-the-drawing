export class DialogIsOpenError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, DialogIsOpenError.prototype);
    }
}
