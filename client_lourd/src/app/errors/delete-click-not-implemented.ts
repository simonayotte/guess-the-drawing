export class DeleteClickNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, DeleteClickNotImplementedError.prototype);
    }
}
