export interface IHash {
    // We disabled this rule since its a callback with zero or multiple parameters which has no type
    // tslint:disable-next-line: no-any
    [details: string]: any;
}
export abstract class AbsCommand {
    abstract execute(callBackMap: IHash): void;
    abstract cancel(callBackMap: IHash): void;
}
