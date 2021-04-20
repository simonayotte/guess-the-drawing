export class Position {

  // tslint:disable-next-line: variable-name
  private _x: number;
  // tslint:disable-next-line: variable-name
  private _y: number;

  constructor(xPosition: number, yPosition: number) {
    this._x = xPosition;
    this._y = yPosition;
  }

  getX(): number {
    return this._x;
  }

  getY(): number {
    return this._y;
  }

  set(position: Position): void {
    this._x = position.getX();
    this._y = position.getY();
  }

  setAtt(xPosition: number, yPosition: number): void {
    this._x = xPosition;
    this._y = yPosition;
  }

  setX(xPosition: number): void {
    this._x = xPosition;
  }

  setY(yPosition: number): void {
    this._y = yPosition;
  }
}
