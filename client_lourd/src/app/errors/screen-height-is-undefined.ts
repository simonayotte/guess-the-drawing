export class ScreenHeightIsUndefinedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ScreenHeightIsUndefinedError.prototype);
    }
}
