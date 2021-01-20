import { async, TestBed } from '@angular/core/testing';
import { Position } from './position';

// tslint:disable-next-line: variable-name
const _y = '_y';
// tslint:disable-next-line: variable-name
const _x = '_x';

const BASE_POSITION = 0;
const A_POSITION = 5;

describe('Position', () => {

  let position: Position;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
          imports: [],
          declarations: [Position],
      });
  }));

  beforeEach(() => {
    position = new Position(BASE_POSITION, BASE_POSITION);
  });

  // set
  it('set should set _x and -y', () => {
    const mockPosition =  new Position(A_POSITION, A_POSITION);

    position.set(mockPosition);

    expect(position[_x]).toBe(A_POSITION);
    expect(position[_y]).toBe(A_POSITION);
  });

  // setAtt
  it('setAtt should set _x and -y', () => {
    position.setAtt(A_POSITION, A_POSITION);

    expect(position[_x]).toBe(A_POSITION);
    expect(position[_y]).toBe(A_POSITION);
  });

  // setX
  it('setY should set _X', () => {
    position.setX(A_POSITION);

    expect(position[_x]).toBe(A_POSITION);
  });

  // setY
  it('setY should set _y', () => {
    position.setY(A_POSITION);

    expect(position[_y]).toBe(A_POSITION);
  });

});
