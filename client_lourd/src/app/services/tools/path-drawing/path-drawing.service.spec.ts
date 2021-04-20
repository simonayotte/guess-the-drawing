import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Position } from 'src/app/models/position';
import { PathDrawingService } from './path-drawing.service';

const RENDERER = 'renderer';
const CURRENT_DIMENSION = 'currentDimension';
const GET_SQUARE_DIMENSION = 'getSquareDimension';
const DRAW_QUADRILATOR = 'drawQuadrilator';
const DRAW_ROUNDED_SHAPE = 'drawRoundedShape';
const FOUR_SIDES = 4;
const FIVE_SIDES = 5;
const EIGHT_SIDES = 8;
const TWELVE_SIDES = 12;
const GET_ANGLE_TO_FURTHEST_POINT_OUTSIDE = 'getAngleToFurthestPointOutside';
const GET_RADIUS = 'getRadius';
const GET_SIGN_CONVERTER = 'getSignConverter';
const DOUBLE_DIMENSION = 2;
const TRIPLE_DIMENSION = 3;
const RAD_ANGLE = 2;
const POSITION_10 = 10;
const POSITION_5 = 5;
const POSITION_20 = 20;
const TIME_CALLED_4 = 4;
const TIME_CALLED_3 = 3;
const MINUS_ONE = -1;

class MockRenderer2 {
  appendChild(): void {
    return;
  }
  setAttribute(): void {
    return;
  }
  createElement(): void {
    return;
  }
}

describe('PathDrawingService', () => {
  let service: PathDrawingService;
  const path: SVGPathElement = {} as SVGPathElement;
  const initialPositionMock = new Position(POSITION_10, POSITION_10);

  const ANGLE_FOUR_SIDES = (RAD_ANGLE * (Math.PI)) / FOUR_SIDES;
  const ANGLE_FIVE_SIDES = (RAD_ANGLE * (Math.PI)) / FIVE_SIDES;
  const ANGLE_EIGHT_SIDES = (RAD_ANGLE * (Math.PI)) / EIGHT_SIDES;
  const ANGLE_TWELVE_SIDES = (RAD_ANGLE * (Math.PI)) / TWELVE_SIDES;
  // const IS_SAME_SIGN = 'isSameSign';

  beforeEach(async(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PathDrawingService] });
    service = TestBed.get(PathDrawingService);
    service[RENDERER] = TestBed.get(Renderer2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // initializedRenderer()
  it('initializedRenderer should initialized renderer', () => {
    service.initializeRenderer(service[RENDERER]);
    expect(service[RENDERER]).toBe(service[RENDERER]);
  });

  // setBasicAttributes
  it('setBasicAttributes should call setAttribute from renderer', () => {
    spyOn(service[RENDERER], 'setAttribute').and.returnValue();
    service.setBasicAttributes(path, 0, 'a color', 'another color');
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(TIME_CALLED_3);
  });

  // setPerimeter()
  it('setPerimeterAttributes should call setAttribute from renderer', () => {
    spyOn(service[RENDERER], 'setAttribute').and.returnValue();
    service.setPerimeterAttributes(path);
    expect(service[RENDERER].setAttribute).toHaveBeenCalledTimes(TIME_CALLED_4);
  });

  // initializePathCircleString()
  it('initializePathCircleStringg should return a string ', () => {
    const cx = 0;
    const cy = 0;
    const returnedString = service.initializePathCircleString(cx, cy);
    expect(returnedString).toBe('M ' + cx + ', ' + cy + ' L ' + cx + ', ' + cy + ' ');
  });

  // circleCreatorString()
  it('circleCreatorString should return a string ', () => {
    const cx = 0;
    const cy = 0;
    const diameter = 2;
    const r = diameter / 2;
    const returnedString = service.circleCreatorString(cx, cy, diameter);
    expect(returnedString).toBe(' L ' + cx + ' ' + cy + ' m -' + r + ', 0 a ' + r + ',' + r + ' 0 1,0 '
    + (r * 2) + ',0 a ' + r + ',' + r + ' 0 1,0 -' + (r * 2) + ',0');
  });

  // lineCreatorString()
  it('lineCreatorString should return a string ', () => {
    const x = 0;
    const y = 0;
    const returnedString = service.lineCreatorString(x, y);
    expect(returnedString).toBe('L ' + x + ' ' + y + ' ');
  });

  // ellipseCreatorString()
  it('ellipseCreatorString should return a string ', () => {
    const returnedString = service.ellipseCreatorString(new Position(0, 1));
    expect(returnedString).toBe('a' + 0 / 2 + ',' + 1 / 2 + ' 0 1,0 1,0 Z');
  });

  // initializePathString()
  it('initializePathString should return a string ', () => {
    const returnedString = service.initializePathString(0, 1);
    expect(returnedString).toBe('M ' +  + 0 + ' ' + 1 + ' ');
  });

  // lineCreatorStringRelative()
  it('lineCreatorStringRelative should return a string ', () => {
    const x = 0;
    const y = 0;
    const returnedString = service.lineCreatorStringRelative(x, y);
    expect(returnedString).toBe('l ' + x + ' ' + y + ' ');
  });

  // setPathString
  it('setPathString should call setAttribute ', () => {
    spyOn(service[RENDERER], 'setAttribute');
    service.setPathString(path, 'a string');
    expect(service[RENDERER].setAttribute).toHaveBeenCalled();
  });

  // drawRectangle()
  it('drawRectangle should call drawQuadrilator', () => {
    const currentPositionMock = new Position(0, 0);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawQuadrilator').and.returnValue(path);
    const returnedValue = service.drawRectangle(initialPositionMock, currentPositionMock, path);

    expect(returnedValue).toBe(path);
  });

  // getSquareDimension()
  it('getSquareDimension should initiate the squares X  and Y dimensions of the smallest one', () => {
    service[CURRENT_DIMENSION] = new Position(-POSITION_10, -POSITION_5);

    let returnedValue = service[GET_SQUARE_DIMENSION]();

    expect(returnedValue).toEqual(new Position(service[CURRENT_DIMENSION].getY(), service[CURRENT_DIMENSION].getY()));

    service[CURRENT_DIMENSION] = new Position(-POSITION_5, -POSITION_10);

    returnedValue = service[GET_SQUARE_DIMENSION]();

    expect(returnedValue).toEqual(new Position(service[CURRENT_DIMENSION].getX(), service[CURRENT_DIMENSION].getX()));
  });

  // getSquareDimension()
  it('getSquareDimension should initiate the squares X  and Y dimensions of the smallest one', () => {
    service[CURRENT_DIMENSION] = new Position(POSITION_10, -POSITION_5);

    let returnedValue = service[GET_SQUARE_DIMENSION]();

    expect(returnedValue).toEqual(new Position(-service[CURRENT_DIMENSION].getY(), service[CURRENT_DIMENSION].getY()));

    service[CURRENT_DIMENSION] = new Position(POSITION_5, -POSITION_10);
    returnedValue = service[GET_SQUARE_DIMENSION]();

    expect(returnedValue).toEqual(new Position(service[CURRENT_DIMENSION].getX(), -service[CURRENT_DIMENSION].getX()));
  });

  // drawSquare()
  it('drawSquare should call setAtt, getSquareDimension, and drawQuadrilator', () => {
    const currentPositionMock = new Position(POSITION_20, POSITION_20);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[CURRENT_DIMENSION], 'setAtt');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'getSquareDimension').and.returnValue(new Position(POSITION_10, POSITION_10));
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawQuadrilator').and.returnValue(path);
    const returnedValue = service.drawSquare(initialPositionMock, currentPositionMock, path);

    expect(service[CURRENT_DIMENSION].setAtt).toHaveBeenCalled();
    expect(service[GET_SQUARE_DIMENSION]).toHaveBeenCalled();
    expect(service[DRAW_QUADRILATOR]).toHaveBeenCalled();
    expect(returnedValue).toBe(path);
  });

  // drawQuadrilator()
  it('drawQuadrilator should call isSameSign,initializePathString, lineCreatorString and setPathString', () => {

    spyOn(service, 'initializePathString').and.returnValue('a string');
    spyOn(service, 'lineCreatorString').and.returnValue('a string');
    spyOn(service, 'setPathString').and.returnValue();
    const returnedValue = service[DRAW_QUADRILATOR](0, 0, 1, 1, path);

    expect(service.initializePathString).toHaveBeenCalledTimes(1);
    expect(service.lineCreatorString).toHaveBeenCalledTimes(TIME_CALLED_3);
    expect(service.setPathString).toHaveBeenCalledTimes(1);
    expect(returnedValue).toBe(path);
  });

  // POLYGONE
  // getAngleToFurthestPointOutside
  it('getAngleToFurthestPointOutside should return the angle that is the most outside ', () => {
    let returnedValue = service[GET_ANGLE_TO_FURTHEST_POINT_OUTSIDE](ANGLE_FIVE_SIDES, FIVE_SIDES);
    expect(returnedValue).toEqual(ANGLE_FIVE_SIDES);

    returnedValue = service[GET_ANGLE_TO_FURTHEST_POINT_OUTSIDE](ANGLE_EIGHT_SIDES, EIGHT_SIDES);
    expect(returnedValue).toEqual(ANGLE_EIGHT_SIDES * DOUBLE_DIMENSION);

    returnedValue = service[GET_ANGLE_TO_FURTHEST_POINT_OUTSIDE](ANGLE_TWELVE_SIDES, TWELVE_SIDES);
    expect(returnedValue).toEqual(ANGLE_TWELVE_SIDES * TRIPLE_DIMENSION);
  });

  // getSignConverter()
  it('getSignConverter should call get square dimension and return the sign of the divison of x and y', () => {
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'getSquareDimension').and.returnValue(new Position(1, MINUS_ONE));
    const returnedValue = service[GET_SIGN_CONVERTER]();

    expect(service[GET_SQUARE_DIMENSION]).toHaveBeenCalled();
    expect(returnedValue).toEqual(MINUS_ONE);
  });

  // getRadius()
  it('getRadius should cos and sin if the number of sides are impair ', () => {
    service[CURRENT_DIMENSION] = new Position(1, 1);
    spyOn(Math, 'cos');
    spyOn(Math, 'sin');
    const returnedValue = service[GET_RADIUS](FIVE_SIDES, ANGLE_FIVE_SIDES, ANGLE_FIVE_SIDES);

    expect(Math.cos).toHaveBeenCalled();
    expect(Math.sin).toHaveBeenCalled();
    const  GOOD_RETURNED_VALUE = 1 / (Math.sin((RAD_ANGLE * (Math.PI)) / FIVE_SIDES) * DOUBLE_DIMENSION);
    expect(returnedValue).toEqual(GOOD_RETURNED_VALUE);
  });

  // getRadius()
  it('getRadius should not call cos if the numbers of sides is pair', () => {
    service[CURRENT_DIMENSION] = new Position(0, 1);
    spyOn(Math, 'sin').and.returnValue(1);
    spyOn(Math, 'cos');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'getSignConverter');
    service[GET_RADIUS](FOUR_SIDES, ANGLE_FOUR_SIDES, ANGLE_FOUR_SIDES);

    expect(Math.cos).toHaveBeenCalledTimes(0);
  });

  // drawPolygone()
  it('drawPolygone should call initializePathString and setPathString, etc', () => {
    const currentPositionMock = new Position(POSITION_20, POSITION_20);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[CURRENT_DIMENSION], 'setAtt');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'getAngleToFurthestPointOutside');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'getRadius');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'getSignConverter');

    spyOn(service, 'initializePathString').and.returnValue('a string');
    spyOn(service, 'setPathString').and.returnValue();
    const returnedValue = service.drawPolygone(initialPositionMock, currentPositionMock, path, FIVE_SIDES);

    expect(service[CURRENT_DIMENSION].setAtt).toHaveBeenCalled();
    expect(service[GET_ANGLE_TO_FURTHEST_POINT_OUTSIDE]).toHaveBeenCalled();
    expect(service[GET_RADIUS]).toHaveBeenCalled();
    expect(service[GET_SIGN_CONVERTER]).toHaveBeenCalled();
    expect(service.initializePathString).toHaveBeenCalled();
    expect(service.setPathString).toHaveBeenCalled();
    expect(returnedValue).toBe(path);
  });

  // ELLIPSE
  // drawEllipse()
  it('drawEllipse should call setAtt, and drawRoundedShape', () => {
    const currentPositionMock = new Position(POSITION_20, POSITION_20);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[CURRENT_DIMENSION], 'setAtt');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawRoundedShape').and.returnValue(path);
    const returnedValue = service.drawEllipse(initialPositionMock, currentPositionMock, path);

    expect(service[CURRENT_DIMENSION].setAtt).toHaveBeenCalled();
    expect(service[DRAW_ROUNDED_SHAPE]).toHaveBeenCalled();
    expect(returnedValue).toBe(path);
  });

   // drawCircle()
  it('drawCircle should call setAtt, getSquareDimension, and drawRoundedShape', () => {
    const currentPositionMock = new Position(POSITION_20, POSITION_20);
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service[CURRENT_DIMENSION], 'setAtt');
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'getSquareDimension').and.returnValue(new Position(POSITION_10, POSITION_10));
    // We disable this lint so we can spy on a private function
    // tslint:disable-next-line: no-any
    spyOn<any>(service, 'drawRoundedShape').and.returnValue(path);
    const returnedValue = service.drawCircle(initialPositionMock, currentPositionMock, path);

    expect(service[CURRENT_DIMENSION].setAtt).toHaveBeenCalled();
    expect(service[GET_SQUARE_DIMENSION]).toHaveBeenCalled();
    expect(service[DRAW_ROUNDED_SHAPE]).toHaveBeenCalled();
    expect(returnedValue).toBe(path);
  });

  // drawRoundedShape
  it('drawRoundedShape should call initializePathString, ellipseCreatorString and setPathString', () => {
    const dimensionMock = new Position(1, 1);
    service[CURRENT_DIMENSION] = new Position(1, 1);
    spyOn(service, 'initializePathString').and.returnValue('a string');
    spyOn(service, 'ellipseCreatorString').and.returnValue('a string');
    spyOn(service, 'setPathString').and.returnValue();
    let returnedValue = service[DRAW_ROUNDED_SHAPE](initialPositionMock, dimensionMock, path);

    expect(service.initializePathString).toHaveBeenCalled();
    expect(service.ellipseCreatorString).toHaveBeenCalled();

    service[CURRENT_DIMENSION] = new Position(0, 0);
    returnedValue = service[DRAW_ROUNDED_SHAPE](initialPositionMock, dimensionMock, path);

    expect(service.setPathString).toHaveBeenCalled();
    expect(returnedValue).toBe(path);
  });

});
