import { ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';

export const CLASSIC = 'classic';
export const RANDOM = 'random';
export const INWARD = 'inwards';
export const OUTWARDS = 'outwards';
export const LEFT_TO_RIGHT = 'left-right';
export const RIGHT_TO_LEFT = 'right-left';
export const DOWN_TO_UP = 'down-up';
export const UP_TO_DOWN = 'up-down';
export const WIDTH = 896;
export const HEIGHT = 440;
export const EASY = 1;
export const MEDIUM = 2;
export const DIFFICULT = 3;
export const TIME_PERCENTAGE_COMPLETION = 0.75;

@Injectable({
  providedIn: 'root'
})
export class WordImagePreviewService{

  private difficulty: number;
  private drawingMode: string;
  private drawingModeOption: string;
  private children: HTMLCollection;
  private svg: ElementRef;
  private renderer: any;
  private pointNumber: number;
  private delayTime: number;
  public draw: boolean;

  constructor() {}

  public initialseRenderer(renderer: any){
    this.renderer = renderer;
  }

  public imagePreview(svg: ElementRef, children: HTMLCollection, difficulty: number, drawingMode: string, drawingModeOption: string){
    if(children !== undefined){
      this.setVariables(svg, children, difficulty, drawingMode, drawingModeOption);
      this.printSVG();
    }
  }

  setVariables(svg: ElementRef, children: HTMLCollection, difficulty: number, drawingMode: string, drawingModeOption: string){
    this.svg = svg;
    this.svg.nativeElement.innerHTML = '';
    this.children = children;
    this.difficulty = difficulty;
    this.drawingMode = drawingMode;
    this.drawingModeOption = drawingModeOption;
    this.pointNumber = 0;
    this.draw = true;
  }

  private async printSVG(){
    const distance = this.getPathOrder();
    const children = this.children;
    this.getDelay();
    for(let i = 0; i < children.length - 5; i++){
      const childNumber = distance[i][1];
      if(this.draw === true)
        await this.drawPath(children.item(childNumber));
    }
  }

  private getDelay(){
    let time = 60000;
    switch(this.difficulty) {
      case EASY : {
        time = 60000;
         break;
      }
      case MEDIUM : {
        time = 40000;
        break;
     }
     case DIFFICULT : {
      time = 20000
      break;
    }
   }
    this.delayTime = time * TIME_PERCENTAGE_COMPLETION / this.pointNumber;
  }

  private async drawPath(child: Element | null){
    if(child !== null){
      const stroke = child.getAttribute('stroke');
      const strokeWidth = child.getAttribute('stroke-width');
      const pathElement =  this.renderer.createElement('path', 'svg');
      if(stroke !== null && strokeWidth !== null){
        this.renderer.setAttribute(pathElement, 'stroke', stroke);
        this.renderer.setAttribute(pathElement, 'stroke-width', strokeWidth);
        this.renderer.setAttribute(pathElement, 'fill', "none");
        this.renderer.setAttribute(pathElement, 'stroke-linejoin', 'round');
        this.renderer.setAttribute(pathElement, 'stroke-linecap', 'round');
        this.renderer.setAttribute(pathElement, 'd', '');
        this.renderer.appendChild(this.svg.nativeElement, pathElement);
        await this.getPoints(child, pathElement);
      }
    }

  }

  private async getPoints(child: Element, pathElement: HTMLElement){
    const pathString = child.getAttribute('d');
    if(pathString !== null){
      const splitted = pathString.split(' ');
      let pointString: string = '';
      for(let i = 0; splitted.length > i + 3; i+=3){
        pointString += splitted[i] + ' ' + splitted[i + 1] + ' ' +splitted[i + 2] + ' ' ;
        pathElement.setAttribute('d', pointString);
        await this.delay(this.delayTime);
      }

    }
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms));
  }

  getPathOrder(){
    const children = this.children;
    let distance: number [][] = [];
    if(this.drawingMode === CLASSIC){
      for(let i = 5; i < children.length; i++){
        distance[i-5] = [];
        distance[i-5][1] = i;
        this.countNumberofPoints(children[i]);
      }
    } else if (this.drawingMode === RANDOM){
      const order = this.randomArrayGenerator(children.length - 5);
      for(let i = 5; i < children.length; i++){
        distance[i-5] = [];
        distance[i-5][1] = order[i - 5] + 4;
        this.countNumberofPoints(children[i]);
      }
    } else {
      for(let i = 5; i < children.length; i++){
        const child = children.item(i);
        if(child !== null){
          this.countNumberofPoints(child);
          const closestDistance = this.getDisanceFromSide(child, this.getComparePoint(child));
          if(closestDistance !== null){
          distance[i-5] = [];
          distance[i-5].push(closestDistance);
          distance[i-5].push(i);
          }
        }
      }
      if(this.drawingModeOption !== INWARD){
        distance = distance.sort(this.sortFunctionAscending);
      }else{
        distance = distance.sort(this.sortFunctionDescending);
      }
    }
    return distance;
  }

  private randomArrayGenerator(length: number){
    const arr = [];
    while(arr.length < length){
     const r = Math.floor(Math.random() * length) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  }

  private countNumberofPoints(child: any){
    const pathString = child.getAttribute('d');
    if(pathString !== null){
      const splitted = pathString.split(' ');
      for(let i = 0; splitted.length > i + 3; i+=3){
        this.pointNumber ++;
      }
    }
  }

  getComparePoint(child: Element){
    if(WIDTH !== null && HEIGHT !== null){
      switch(this.drawingModeOption) {
        case INWARD: {
          return  [+WIDTH/2, +HEIGHT/2];
        }
        case OUTWARDS: {
          return  [+WIDTH/2, +HEIGHT/2];
        }
        case LEFT_TO_RIGHT: {
          return [0,0];
        }
        case RIGHT_TO_LEFT: {
          return [+HEIGHT, 0];
        }
        case UP_TO_DOWN: {
          return [0,0];
        }
        case DOWN_TO_UP: {
          return [0,+HEIGHT];
        }
     }
    }
    return [0,0];
  }

  getDisanceFromSide(child: Element, comparisonPoint: number[]){
    const pathString = child.getAttribute('d');
    if(pathString !== null){
      const splitted = pathString.split(' ');
      let distance: number;
      let intermidiateDistance: number;

      if(this.drawingModeOption === INWARD){
        distance = 0;
        for(let i = 0; splitted.length > i + 3; i+=3){
          intermidiateDistance = this.distanceBetweenTwoPoint(comparisonPoint, [+splitted[i + 1], +splitted[i + 2]]);
          if (intermidiateDistance > distance){
            distance = intermidiateDistance;
          }
        }
        return distance;
      }else{
        distance = 99999;
      for(let i = 0; splitted.length > i + 3; i+=3){
        if(this.drawingModeOption === RIGHT_TO_LEFT || this.drawingModeOption === LEFT_TO_RIGHT){
          intermidiateDistance = Math.abs( +splitted[i + 1] - comparisonPoint[0]);
        }else if( this.drawingModeOption === UP_TO_DOWN || this.drawingModeOption === DOWN_TO_UP){
          intermidiateDistance = Math.abs( +splitted[i + 2] - comparisonPoint[1]);
        }else{
          intermidiateDistance = this.distanceBetweenTwoPoint(comparisonPoint, [+splitted[i + 1], +splitted[i + 2]]);
        }
        if (intermidiateDistance < distance){
          distance = intermidiateDistance;
        }
      }
      return distance;
      }
    }
    return null;
  }

  distanceBetweenTwoPoint(pointOne: number [], pointTwo: number []){
    return Math.sqrt( Math.pow(pointOne[0] - pointTwo[0], 2) + Math.pow(pointOne[1] - pointTwo[1], 2));
  }

  sortFunctionAscending(a: any, b: any) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
  }

  sortFunctionDescending(a: any, b: any) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
  }

}
