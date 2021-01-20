export class RendererNotImplementedError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, RendererNotImplementedError.prototype);
    }
}
