import { async, TestBed } from '@angular/core/testing';
import { PathManipulation } from './path-manipulation';
import { Position } from './position';

const _Y = '_y';
const _X = '_x';

const DELETE_1_POINT = 1;
const DELETE_2_POINT = 2;
const PATH_1_POINT = 'M 0 0 ';
const PATH_2_POINTS = 'M 0 0 L 50 50 ';
const PATH_3_POINTS = 'M 0 0 L 50 50 L 100 100 ';
const CURRENT_POSITION = 50;
const INITIAL_POSITION = 0;

describe('Position', () => {

  let pathManipulation: PathManipulation;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
          imports: [],
          declarations: [PathManipulation],
      });
  }));

  beforeEach(() => {
    pathManipulation = new PathManipulation();
  });

  // getFirstPosition
  it('getFirstPosition should return intial position', () => {
    let returnPosition: Position;
    returnPosition = pathManipulation.getFirstPosition(PATH_2_POINTS);

    expect(returnPosition[_X]).toBe(INITIAL_POSITION);
    expect(returnPosition[_Y]).toBe(INITIAL_POSITION);
  });

  // getPastPosition
  it('getPastPosition should return past position', () => {
    let returnPosition: Position;
    returnPosition = pathManipulation.getPastPosition(PATH_3_POINTS);

    expect(returnPosition[_X]).toBe(CURRENT_POSITION);
    expect(returnPosition[_Y]).toBe(CURRENT_POSITION);
  });

  it('getPastPosition should return intial position', () => {
    let returnPosition: Position;
    returnPosition = pathManipulation.getPastPosition(PATH_2_POINTS);

    expect(returnPosition[_X]).toBe(INITIAL_POSITION);
    expect(returnPosition[_Y]).toBe(INITIAL_POSITION);
  });

  // getCurrentPosition
  it('getCurrentPosition should return current position', () => {
    let returnPosition: Position;
    returnPosition = pathManipulation.getCurrentPosition(PATH_2_POINTS);

    expect(returnPosition[_X]).toBe(CURRENT_POSITION);
    expect(returnPosition[_Y]).toBe(CURRENT_POSITION);
  });

  // deleteLastPosition
  it('deleteLastPosition should delete one point', () => {
    const returnPath = pathManipulation.deleteLastPosition(PATH_2_POINTS, DELETE_1_POINT);

    expect(returnPath).toBe(PATH_1_POINT);
  });

  it('deleteLastPosition should delete two point', () => {
    const returnPath = pathManipulation.deleteLastPosition(PATH_3_POINTS, DELETE_2_POINT);

    expect(returnPath).toBe(PATH_1_POINT);
  });

});
