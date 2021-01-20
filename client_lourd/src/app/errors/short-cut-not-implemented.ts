export class ShortCutNotImplemented extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ShortCutNotImplemented.prototype);
    }
}
