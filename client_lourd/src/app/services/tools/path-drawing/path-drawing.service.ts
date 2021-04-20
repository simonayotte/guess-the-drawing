import { Injectable, Renderer2 } from '@angular/core';
import { Position } from '../../../models/position';

const HALF_DIMENSION = 2;
const DOUBLE_DIMENSION = 2;
const TRIPLE_DIMENSION = 3;
const RAD_ANGLE = 2;
const PAIR_NUMBER_OF_SIDES = 2;
const SIDES_NUMBRE_7 = 7;
const SIDES_NUMBRE_11 = 11;

@Injectable({
  providedIn: 'root'
})
export class PathDrawingService {

  private renderer: Renderer2;
  private currentDimension: Position = new Position(0, 0);
  private pathString: string;

  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
  }

  initializePathString(initialX: number, initialY: number): string {
    return 'M ' +  + initialX + ' ' + initialY + ' ';
  }

  initializePathCircleString(cx: number, cy: number): string {
    return 'M ' + cx + ', ' + cy + ' L ' + cx + ', ' + cy + ' ';
  }

  setBasicAttributes(path: SVGPathElement, size: number, lineColor: string, fillColor: string): void {
    this.renderer.setAttribute(path, 'stroke-width', size.toString());
    this.renderer.setAttribute(path, 'stroke', lineColor);
    this.renderer.setAttribute(path, 'fill', fillColor);
  }

  setPerimeterAttributes(path: SVGPathElement): void {
    this.renderer.setAttribute(path, 'stroke-width', '1');
    this.renderer.setAttribute(path, 'stroke', 'red');
    this.renderer.setAttribute(path, 'stroke-dasharray', '5,5');
    this.renderer.setAttribute(path, 'fill', 'none');

  }

  lineCreatorString(x: number, y: number): string {
    return 'L ' + x + ' ' + y + ' ';
  }

  circleCreatorString(cx: number, cy: number, diameter: number): string {
    const r = diameter / 2;
    return ' L ' + cx + ' ' + cy + ' m -' + r + ', 0 a ' + r + ',' + r + ' 0 1,0 '
    + (r * 2) + ',0 a ' + r + ',' + r + ' 0 1,0 -' + (r * 2) + ',0';
  }

  ellipseCreatorString(dimensions: Position): string {
    return 'a' + dimensions.getX() / 2 + ',' + dimensions.getY() / 2 + ' 0 1,0 1,0 Z';
  }

  lineCreatorStringRelative(x: number, y: number): string {
    return this.pathString = 'l ' + x + ' ' + y + ' ';
  }

  setPathString(path: SVGPathElement, pathString: string): void {
    this.renderer.setAttribute(path, 'd', pathString);
  }

  // Rectangle
  private isSameSign(component1: number, component2: number): boolean {
    return (component1 > 0 && component2 > 0) || (component1 < 0 && component2 < 0);
  }

  private getSquareDimension(): Position {
    const square = new Position(0, 0);

    if (Math.abs(this.currentDimension.getX()) < Math.abs(this.currentDimension.getY())) {
      square.setX(this.currentDimension.getX());
      square.setY(  this.isSameSign(this.currentDimension.getX(), this.currentDimension.getY()) ?
                    this.currentDimension.getX() : - this.currentDimension.getX());
    } else {
      square.setX(( this.isSameSign(this.currentDimension.getX(), this.currentDimension.getY())) ?
                    this.currentDimension.getY() : - this.currentDimension.getY());
      square.setY(this.currentDimension.getY());
    }
    return square;
  }

  drawRectangle(initialPosition: Position, currentPosition: Position, path: SVGPathElement): SVGPathElement {
    return this.drawQuadrilator(initialPosition.getX(), initialPosition.getY(), currentPosition.getX(), currentPosition.getY(), path);
  }

  drawSquare(initialPosition: Position, currentPosition: Position, path: SVGPathElement): SVGPathElement {
    this.currentDimension.setAtt(currentPosition.getX() - initialPosition.getX(), currentPosition.getY() - initialPosition.getY());
    const squareDimension = this.getSquareDimension();

    return this.drawQuadrilator(initialPosition.getX(),
                                initialPosition.getY(),
                                initialPosition.getX() + squareDimension.getX(),
                                initialPosition.getY() + squareDimension.getY(),
                                path);
  }

  private drawQuadrilator(startX: number, startY: number, finalX: number, finalY: number, path: SVGPathElement): SVGPathElement {
    this.pathString = this.quadrilatorString(startX, startY, finalX, finalY);
    this.setPathString(path, this.pathString);
    return path;
  }

  quadrilatorString(startX: number, startY: number, finalX: number, finalY: number): string {
    this.pathString = this.initializePathString(startX, startY);
    this.pathString += this.lineCreatorString(startX, finalY);
    this.pathString += this.lineCreatorString(finalX, finalY);
    this.pathString += this.lineCreatorString(finalX, startY);
    this.pathString += 'Z';
    return this.pathString;
  }

  // Polygone
  private getAngleToFurthestPointOutside(insideAngle: number, nbSides: number): number {
    let angleToFurthestPointOutside = insideAngle;
    if (nbSides >= SIDES_NUMBRE_11) {
      angleToFurthestPointOutside = insideAngle * TRIPLE_DIMENSION;
    } else if (nbSides >= SIDES_NUMBRE_7) {
      angleToFurthestPointOutside = insideAngle * DOUBLE_DIMENSION;
    }
    return angleToFurthestPointOutside;
  }

  private getSignConverter(): number {
    const squareDimension = this.getSquareDimension();
    return squareDimension.getX() / squareDimension.getY();
  }

  private getRadius(nbSides: number, insideAngle: number, angleToFurthestPointOutside: number): number {
    const dimensionY = (nbSides % PAIR_NUMBER_OF_SIDES === 0) ? this.currentDimension.getY() / HALF_DIMENSION :
                                                              this.currentDimension.getY() / ( 1 + Math.cos(insideAngle / HALF_DIMENSION));
    const dimensionX =  this.currentDimension.getX() / (Math.sin(angleToFurthestPointOutside) * DOUBLE_DIMENSION);

    const radius = (Math.abs(dimensionY * (Math.sin(angleToFurthestPointOutside) * DOUBLE_DIMENSION)) >
                    Math.abs( this.currentDimension.getX())) ?
                  dimensionX : this.getSignConverter() * dimensionY;
    return radius;
  }

  drawPolygone(initialPosition: Position, currentPosition: Position, path: SVGPathElement, nbSides: number): SVGPathElement {
    const insideAngle = (RAD_ANGLE * (Math.PI)) / nbSides;
    const angleToFurthestPointOutside = this.getAngleToFurthestPointOutside(insideAngle, nbSides);
    this.currentDimension.setAtt(currentPosition.getX() - initialPosition.getX(), currentPosition.getY() - initialPosition.getY());

    const radiusX = this.getRadius(nbSides, insideAngle, angleToFurthestPointOutside);
    const radiusY = this.getSignConverter() * radiusX;

    const middlePoint = new Position( initialPosition.getX() + (Math.sin(angleToFurthestPointOutside) * radiusX),
                                      initialPosition.getY() + radiusY);

    this.pathString = this.initializePathString(middlePoint.getX(), initialPosition.getY());
    let rotationAngle = 0;
    let nextX: number;
    let nextY: number;
    for (let i = 1; i < nbSides; i++) {
      rotationAngle += insideAngle;
      nextX = middlePoint.getX() - (Math.sin(rotationAngle) * radiusX);
      nextY = middlePoint.getY() - (Math.cos(rotationAngle) * radiusY);
      this.pathString += this.lineCreatorString(nextX, nextY);
    }
    this.pathString += 'Z';
    this.setPathString(path, this.pathString);
    return path;
  }

  // Ellipse
  drawEllipse(initialPosition: Position, currentPosition: Position, path: SVGPathElement): SVGPathElement {
    this.currentDimension.setAtt(currentPosition.getX() - initialPosition.getX(), currentPosition.getY() - initialPosition.getY());
    return this.drawRoundedShape(initialPosition, this.currentDimension, path);
  }

  drawCircle(initialPosition: Position, currentPosition: Position, path: SVGPathElement): SVGPathElement {
    this.currentDimension.setAtt(currentPosition.getX() - initialPosition.getX(), currentPosition.getY() - initialPosition.getY());
    return this.drawRoundedShape(initialPosition, this.getSquareDimension(), path);
  }

  private drawRoundedShape(initialPosition: Position, dimensions: Position, path: SVGPathElement): SVGPathElement {
    if (this.currentDimension.getY() > 0) {
      this.pathString = this.initializePathString(initialPosition.getX() + dimensions.getX() / 2, initialPosition.getY());
    } else {
      this.pathString = this.initializePathString(initialPosition.getX() + dimensions.getX() / 2,
                                                  initialPosition.getY() + dimensions.getY());
    }
    this.pathString += this.ellipseCreatorString(dimensions);
    this.setPathString(path, this.pathString);
    return path;
  }
}
