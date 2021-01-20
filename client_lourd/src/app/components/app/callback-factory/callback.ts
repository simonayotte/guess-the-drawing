// NOTE : we can't predict the callback's return type nor its arguments',
//        so we disabled the no-any rule for this file.

export class Callback {
  callback: () => void;
  // tslint:disable-next-line: no-any
  args: any;

  // tslint:disable-next-line: no-any
  constructor(method: (...args: any) => any, ...args: any) {
    this.callback = method;
    this.args = Array.prototype.slice.call(args, 0);
  }

  // tslint:disable-next-line: no-any
  call(): any {
    return this.callback.apply(this, this.args);
  }
}
