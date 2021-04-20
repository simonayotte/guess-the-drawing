import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { SvgService } from '../svg-service/svg.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { DrawingSizeService } from '../drawing/drawing-size.service';
import { Renderer2 } from '@angular/core';
import { RendererProviderService } from '../rendererProvider/renderer-provider.service';
import { CommandInvokerService } from '../drawing/command-invoker.service';
import { SERVER_BASE } from 'src/app/models/server-data';
import { QUICKDRAW_URL } from '../../../assets/quickdraw/quickdrawURL';

export const DRAWING_ENDPOINT = "pmi/drawing";
export const POINT_ENDPOINT = "pmi/point";
export const QUICKDRAW_ENDPOINT = "pmi/quickdraw";
export const POPULATE_QUICKDRAW_ENDPOINT = "pmi/populate-quickdraw";
export const CLASSIC = 'classic';
export const RANDOM = 'random';
export const INWARD = 'inwards';
export const OUTWARDS = 'outwards';
export const LEFT_TO_RIGHT = 'left-right';
export const RIGHT_TO_LEFT = 'right-left';
export const DOWN_TO_UP = 'down-up';
export const UP_TO_DOWN = 'up-down';
export const WIDTH = 'width';
export const HEIGHT = 'height';
export const API_ENDPOINT = 'https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8';
export const STENCILS_ENDPOINT = '../../../assets/quickdraw/stencils.json';
const CLIENT_LEGER_CANVAS_WIDTH: number = 1026;
const CLIENT_LEGER_CANVAS_HEIGHT: number = 681;

@Injectable({
  providedIn: 'root'
})


export class WordImageService {

  readonly IMPORT = 'import';
  readonly DRAW = 'draw';
  readonly QUICKDRAW = 'quickdraw';

  private wordName: string;
  private difficulty: number;
  private hints: string[];
  private drawingMode: string;
  private drawingModeOption: string;
  private heightRatio: number;
  private widthRatio: number;
  private children: HTMLCollection;
  private renderer:  Renderer2;
  private potraceChildren : HTMLCollection;
  private quickdrawChildren : HTMLCollection;
  private creationMode: string;
  private lastQuickdrawWord = "";
  private canvasHeight: number;
  private canvasWidth:number;


  constructor(private svgService: SvgService,
    private http: HttpClient,
    private drawingSizeService: DrawingSizeService,
    private rendererProvider: RendererProviderService,
    private commandInvokerService: CommandInvokerService
    ) {

      this.drawingSizeService.widthBS.subscribe((value) => {
        this.widthRatio = value / CLIENT_LEGER_CANVAS_WIDTH;
        this.canvasWidth = value;
      });

      this.drawingSizeService.heightBS.subscribe((value) => {
        this.heightRatio = value / CLIENT_LEGER_CANVAS_HEIGHT;
        this.canvasHeight = value;
      });

  }

  savePairMotImage(wordName: string, difficulty: number, hints: string[], drawingMode: string, drawingModeOption: string, creationMode: string){
    this.setVariables(wordName, difficulty, hints, drawingMode, drawingModeOption, creationMode);
    if(creationMode === this.IMPORT){
      this.children = this.potraceChildren;
    } else if (creationMode === this.DRAW) {
      this.children = this.svgService.svgSubject.value.children;
    } else {
      this.children = this.quickdrawChildren
    }
    this.postDrawing(this.formatDrawingData());

  }

  setVariables(wordName: string, difficulty: number, hints: string[], drawingMode: string, drawingModeOption: string, creationMode: string){
    this.wordName = wordName;
    this.difficulty = difficulty;
    this.hints = hints;
    this.drawingMode = drawingMode;
    this.drawingModeOption = drawingModeOption;
    this.creationMode = creationMode;
  }

  private formatDrawingData (){
    let hintString = '[';
    for(const hint of this.hints){
      hintString += hint + ',';
    }
    hintString = hintString.slice(0, hintString.length - 1) + ']';

    return{word: this.wordName, difficulty: this.difficulty, hints: this.hints, isRandom: this.drawingMode === RANDOM? true: false};
  }

  async populateQuickdraw(index: number) {
    if(index < QUICKDRAW_URL.length){
      await this.http.post(SERVER_BASE + POPULATE_QUICKDRAW_ENDPOINT, {category: QUICKDRAW_URL[index]}).pipe(
        tap(),
        catchError(this.handleError)
      ).toPromise();
    }
  }


  async getQuickdrawSvg() {
    let drawingSvg: string[] = [];
    let drawingWord: string = "";
    await this.http.post(SERVER_BASE + QUICKDRAW_ENDPOINT, {previousWord: this.lastQuickdrawWord}).pipe(
      tap((response: any) =>  {
        this.lastQuickdrawWord = response.word;
        drawingSvg = response.quickdraw;
        drawingWord = response.word;
      }),
      catchError(this.handleError)
    ).toPromise();

    let drawingSvgString: string = " ";
    for(const svgElem of drawingSvg) {
      const firstChar = svgElem.slice(0, 1);
      if(firstChar === "L"){
        drawingSvgString += ' ';
      }
      drawingSvgString += svgElem;
    }

    return [drawingWord, drawingSvgString];
  }

  public async postDrawing(postData: any) {

    this.http.post(SERVER_BASE + DRAWING_ENDPOINT, postData).pipe(
      tap((response: any) =>  {
        this.postPoints(response.idDrawing);
      }),
      catchError(this.handleError)
    ).toPromise();


  }

  private postPoints(idDrawing: number){
    const distance = this.getPathOrder();
    const children = this.children;
    for(let i = 0; i < children.length - 5; i++){
      const childNumber = distance[i][1];
      const postData = this.getPointsData(children.item(childNumber), idDrawing, i);
      this.http.post(SERVER_BASE + POINT_ENDPOINT, postData).pipe(
        tap(),
        catchError(this.handleError)
      ).toPromise();

    }
    if(this.creationMode === this.DRAW){
      this.commandInvokerService.newDrawing();
    }
  }

  getPathOrder(){
    const children = this.children;
    let distance: number [][] = [];
    if(this.drawingMode === CLASSIC || this.drawingMode === RANDOM){
      for(let i = 5; i < children.length; i++){
        distance[i-5] = [];
        distance[i-5][1] = i;
      }
    }else {
      for(let i = 5; i < children.length; i++){
        const child = children.item(i);
        if(child !== null){
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

  getComparePoint(child: Element){
    const svg = this.svgService.svgSubject.value;
    const width = svg.getAttribute(WIDTH);
    const height = svg.getAttribute(HEIGHT);
    if(width !== null && height !== null){
      switch(this.drawingModeOption) {
        case INWARD: {
          return  [+width/2, +height/2];
        }
        case OUTWARDS: {
          return  [+width/2, +height/2];
        }
        case LEFT_TO_RIGHT: {
          return [0,0];
        }
        case RIGHT_TO_LEFT: {
          return [+width, 0];
        }
        case UP_TO_DOWN: {
          return [0,0];
        }
        case DOWN_TO_UP: {
          return [0,+height];
        }
     }
    }
    return [0,0];
  }

  private getPointsData(child: Element | null, idDrawing: number, order: number){
    if(child !== null){
      const point = this.getPoints(child);
      const thickness = child.getAttribute('stroke-width');
      const rgbaString = child.getAttribute('stroke');
      if(thickness !== null && rgbaString !== null){
      const color = rgbaString;
      return {idDrawing ,point, thickness: this.convertWebThicknessToAndroid(+thickness), color, pathOrder: order};
      }
    }
    return null;
  }

  private getPoints(child: Element){
    const pathString = child.getAttribute('d');
    if(pathString !== null){
      const splitted = pathString.split(' ');
      let pointString: string = '{';
      for(let i = 0; splitted.length > i + 3; i+=3){
        pointString += '{' + this.webToAndroidWidthResize(+splitted[i +1]) + ',' + this.webToAndroidHeightResize(+splitted[i +2]) + '},';
      }
      pointString = pointString.slice(0, pointString.length -1);
      pointString += '}';
      return pointString;
    }
    return null;
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

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 401 || error instanceof ErrorEvent) {
      // Client-side or network error
      return throwError('Un problème est survenu lors de la connexion au serveur. Veuillez réessayer.');
    } else {
      // The server returned an unsuccessful response code. We return the message.
      // For example: 'Utilisateur déjà existant' when signing up or 'Mot de passe invalide' when signing in, etc.
      return throwError(error.error.message);
    }
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

  private webToAndroidWidthResize(width: number) {
    return width/this.widthRatio;
  }

  private webToAndroidHeightResize(height: number) {
    return height/this.heightRatio;
  }

  public transformPathToElementQuickdraw(svgString: string){
    this.renderer = this.rendererProvider.getRendererInstance();
    const tempElement = this.renderer.createElement('svg');
    tempElement.innerHTML = svgString;
    const pathArray: string [] = [];
    const pointRatio = this.getRatio(tempElement.children[0].getAttribute('height'), tempElement.children[0].getAttribute('width'));

    for(const child of tempElement.children[0].children){
      const splitted = child.getAttribute('d').split(' ');
      let tempString: string = 'M ';
      for(let i = 1; splitted.length > i; i++){
        if(splitted[i] === 'M'){
          pathArray.push(tempString);
          tempString = 'M ';
        } else if (splitted[i] === 'C'){
          i += 4;
          tempString += 'L ';
        } else if (splitted[i] === 'L'){
          tempString += (splitted[i]) + ' ';
        } else{
          tempString += (+splitted[i]/pointRatio + 125) + ' ';
        }
      }
      pathArray.push(tempString);
    }

    tempElement.innerHTML = '';


    for (let i = 0 ; i < 5; i++){
      const pathElement = this.renderer.createElement('path', 'svg');
      this.renderer.appendChild(tempElement, pathElement);
    }

    for (const path of pathArray){
      const pathElement = this.renderer.createElement('path', 'svg');
      this.renderer.setAttribute(pathElement, 'stroke', 'rgba(0, 0, 0, 1)');
      this.renderer.setAttribute(pathElement, 'stroke-width', '1');
      this.renderer.setAttribute(pathElement, 'd', path);
      this.renderer.setAttribute(pathElement, 'fill', "none");
      this.renderer.appendChild(tempElement, pathElement);
    }

    this.quickdrawChildren =  tempElement.children;


    const returnElement = this.renderer.createElement('svg');

    for (const path of pathArray){
      const pathElement = this.renderer.createElement('path', 'svg');
      this.renderer.setAttribute(pathElement, 'stroke', 'rgba(0, 0, 0, 1)');
      this.renderer.setAttribute(pathElement, 'stroke-width', '1');
      this.renderer.setAttribute(pathElement, 'd', path);
      this.renderer.setAttribute(pathElement, 'fill', "none");
      this.renderer.appendChild(returnElement, pathElement);
    }

    return returnElement;
  }


  public transformPathToElement(svgString: string){
    this.renderer = this.rendererProvider.getRendererInstance();
    const tempElement = this.renderer.createElement('svg');
    tempElement.innerHTML = svgString;
    const pointRatio = this.getRatio(tempElement.children[0].getAttribute('height'), tempElement.children[0].getAttribute('width'));
    const splitted = tempElement.children[0].children[0].getAttribute('d').split(' ');
    const pathArray: string [] = [];
    let tempString: string = 'M ';
    for(let i = 1; splitted.length > i; i++){
      if(splitted[i] === 'M'){
        pathArray.push(tempString);
        tempString = 'M ';
      } else if (splitted[i] === 'C'){
        i += 4;
        tempString += 'L ';
      } else if (splitted[i] === 'L'){
        tempString += splitted[i] + ' ';
        i++;
        tempString += (+splitted[i]/pointRatio) + ' ';
        i++;
        tempString += (+splitted[i]/pointRatio) + ' ';
        tempString += 'L ';
      } else{
        tempString += (+splitted[i]/pointRatio) + ' ';
      }

    }
    pathArray.push(tempString);
    tempElement.innerHTML = '';


    for (let i = 0 ; i < 5; i++){
      const pathElement = this.renderer.createElement('path', 'svg');
      this.renderer.appendChild(tempElement, pathElement);
    }

    for (const path of pathArray){
      const pathElement = this.renderer.createElement('path', 'svg');
      this.renderer.setAttribute(pathElement, 'stroke', 'rgba(0, 0, 0, 1)');
      this.renderer.setAttribute(pathElement, 'stroke-width', '1');
      this.renderer.setAttribute(pathElement, 'd', path);
      this.renderer.setAttribute(pathElement, 'fill', "none");
      this.renderer.appendChild(tempElement, pathElement);
    }

    this.potraceChildren =  tempElement.children;


    const returnElement = this.renderer.createElement('svg');

    for (const path of pathArray){
      const pathElement = this.renderer.createElement('path', 'svg');
      this.renderer.setAttribute(pathElement, 'stroke', 'rgba(0, 0, 0, 1)');
      this.renderer.setAttribute(pathElement, 'stroke-width', '1');
      this.renderer.setAttribute(pathElement, 'd', path);
      this.renderer.setAttribute(pathElement, 'fill', "none");
      this.renderer.appendChild(returnElement, pathElement);
    }

    return returnElement;
  }

  private getRatio(height: number, width: number){
    const widthRatio =  width / this.drawingSizeService.widthBS.value;
    const heightRatio = height / this.drawingSizeService.heightBS.value;

    if(widthRatio > 1 || heightRatio > 1){
      if(widthRatio > heightRatio){
        return widthRatio;
      }
      return heightRatio;
    }
    return 1;
  }

  public returnChildren(creationMode: string){
    if(creationMode === this.IMPORT){
      return this.potraceChildren;
    } else if (creationMode === this.DRAW){
      return this.children = this.svgService.svgSubject.value.children;
    } else {
      return this.quickdrawChildren;
    }
  }

  private convertWebThicknessToAndroid(webThickness:number) {
    const androidThickness = (webThickness/ (this.canvasHeight * this.canvasWidth)) * (CLIENT_LEGER_CANVAS_HEIGHT * CLIENT_LEGER_CANVAS_WIDTH)
    return Math.round(androidThickness)
  }

}
