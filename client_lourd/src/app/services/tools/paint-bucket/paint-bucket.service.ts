import { Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { CanvasManager } from 'src/app/components/app/tools/graphics/canvas-manager';
import { IDimensions } from 'src/app/components/app/tools/graphics/graphics-types';
import { SvgManager } from 'src/app/components/app/tools/graphics/svg-manager';
import { DrawCommand } from '../../../components/app/command/draw-command';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { SvgService } from '../../svg-service/svg.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';

const POSTION_R = 0;
const POSTION_G = 1;
const POSTION_B = 2;
const POSTION_A = 3;
const MAX_VALUE = 255;
const PERCENT_100 = 100;
const NUMBER_COLOR = 3;
const TURN_IN_PERCENT = PERCENT_100 / ( MAX_VALUE * NUMBER_COLOR);
const IS_NOT_BORDER_PIXEL = 4;
const PREVIOUS_PIXEL = -1;
const SECONDE_PREVIOUS_PIXEL = -2;
const PIXEL_X = [1, 0 , PREVIOUS_PIXEL, 0];
const PIXEL_Y = [0, 1, 0, PREVIOUS_PIXEL];
const POSITION_TO_CHECK = 4;
const INVALID_INDEX = -1;
const SEARCH_POSITION_X = [1, 1, 0, PREVIOUS_PIXEL, PREVIOUS_PIXEL, PREVIOUS_PIXEL,
  0, 1, 2, 2, 2, 1, 0, PREVIOUS_PIXEL, SECONDE_PREVIOUS_PIXEL, SECONDE_PREVIOUS_PIXEL, SECONDE_PREVIOUS_PIXEL,
  SECONDE_PREVIOUS_PIXEL, SECONDE_PREVIOUS_PIXEL, PREVIOUS_PIXEL, 0, 1, 2, 2];
const SEARCH_POSITION_Y = [0, PREVIOUS_PIXEL, PREVIOUS_PIXEL, PREVIOUS_PIXEL, 0, 1, 1, 1,
0, PREVIOUS_PIXEL, SECONDE_PREVIOUS_PIXEL, SECONDE_PREVIOUS_PIXEL, SECONDE_PREVIOUS_PIXEL,
SECONDE_PREVIOUS_PIXEL, SECONDE_PREVIOUS_PIXEL, PREVIOUS_PIXEL, 0, 1, 2, 2, 2, 2, 2, 1];
const NB_PIXEL_TO_CHECK = 24;
const SVG = 'svg';
const PATH = 'path';
const MIN_LENGHT = 4;
const FIRST_OF_ARRAY = 0;
const FILL = 'fill';
const G_CONTAINER = 'g';
const MASK = 'mask';
const WHITE = 'white';
const BLACK = 'black';
const MASK_BEGINNING_STRING = 'url(#';
const MASK_END_STRING = ')';
const ID = 'id';
const ID_LENGHT = 6;

@Injectable({
  providedIn: 'root'
})
export class PaintBucketService {

  private renderer: Renderer2;
  private canvas: HTMLCanvasElement;
  private img: HTMLImageElement;
  private ctx: CanvasRenderingContext2D;
  private dimensions: IDimensions;
  private checkedPosition: number[][];
  private pixelToChange: IDimensions[];
  private clickedPixelColor: Color;

  constructor(private pathDrawingService: PathDrawingService, private svgService: SvgService,
              private selectedColors: SelectedColorsService, private commandInvoker: CommandInvokerService) {
    this.img = new Image();
    this.svgService.svgSubject.subscribe( (result: SVGPathElement ) => {
      if (result !== undefined) {
       this.dimensions = SvgManager.getDimensions(result);
       this.img.src = SvgManager.getB64(result);
      }
    });

    this.img.onload = () => {
      CanvasManager.resize(this.canvas, this.dimensions);
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        this.ctx = ctx;
        this.ctx.drawImage(this.img, 0, 0, this.dimensions.width , this.dimensions.height);
      }
    };
  }

  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
    this.pathDrawingService.initializeRenderer(renderer);
    this.canvas = this.renderer.createElement('canvas');
  }

  onMouseDownInElement(event: MouseEvent, acceptedTolerance: number): SVGPathElement {
    this.resetArrays();
    this.clickedPixelColor = this.getColor(event.offsetX, event.offsetY);
    this.getAllBorderPixel(event, acceptedTolerance);
    const returnPath = this.createReturnPath();
    returnPath.setAttribute('id', 'bucketFill');
    this.commandInvoker.addCommand(new DrawCommand(returnPath));
    return returnPath;
  }

  private createReturnPath(): SVGPathElement {
    const forms = this.getAllForms();
    const id = this.makeid(ID_LENGHT);
    const mask = this.createMask(id);
    for (let i = 0; i < forms.length; i++) {
      let path: SVGPathElement;
      if ( i === 0) {
        path = this.createPath(forms[i], WHITE, null);
      } else {
        path = this.createPath(forms[i], BLACK, null);
      }
      this.renderer.appendChild(mask, path);
    }
    const coloredPath = this.createPath(forms[0], null, id);
    const g = this.createGContainer();
    this.renderer.appendChild(g, mask);
    this.renderer.appendChild(g, coloredPath);
    return g;
  }

  private makeid(length: number): string {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private createMask(id: string): SVGPathElement {
    const mask = this.renderer.createElement(MASK, SVG);
    this.renderer.setAttribute(mask, ID, id);
    return mask;
  }

  private createGContainer(): SVGPathElement {
    const g = this.renderer.createElement(G_CONTAINER, SVG);
    this.renderer.setAttribute(g, FILL, this.selectedColors.primaryColorBS.getValue().strFormat());
    return g;
  }

  private createPath(form: IDimensions[], fill: string | null, id: string | null): SVGPathElement {
    const path = this.renderer.createElement(PATH, SVG);
    this.pathDrawingService.setPathString(path, this.getPathString(form));
    if ( fill !== null) {
      this.renderer.setAttribute(path, FILL, fill);
    }
    if ( id !== null ) {
      this.renderer.setAttribute(path, MASK, MASK_BEGINNING_STRING + id + MASK_END_STRING);
    }
    return path;
  }

  private getPathString(form: IDimensions[]): string {
    let pathString = this.pathDrawingService.initializePathString(form[0].width, form[0].height);
    for ( const pixel of form) {
      pathString += this.pathDrawingService.lineCreatorString(pixel.width, pixel.height);
    }
    return pathString;
  }

  private getAllForms(): IDimensions[][] {
    const forms = [];
    forms.push(this.getForm(this.getExteriorPixel()));
    while ( this.pixelToChange.length > 0) {
      const form = this.getForm(this.pixelToChange[0]);
      if (form.length > MIN_LENGHT) {
        forms.push(form);
      }
    }
    return forms;
  }

  private getExteriorPixel(): IDimensions {
    let exteriorPixel = this.pixelToChange[0];
    for (const pixel of this.pixelToChange) {
      if ((pixel.width <= exteriorPixel.width) && (pixel.height <= exteriorPixel.height)) {
        exteriorPixel = pixel;
      }
    }
    return exteriorPixel;
  }

  private getForm(firstPixel: IDimensions): IDimensions[] {
    const form: IDimensions[] = [];
    let nextPixel = firstPixel;
    this.pixelToChange.splice(FIRST_OF_ARRAY, 1);
    form.push(firstPixel);
    while ( this.pixelToChange.length > 0) {
      nextPixel = this.findNextPixel(nextPixel);
      if ( nextPixel !== null) {
        form.push(nextPixel);
      } else {
        break;
      }
    }
    return form;
  }

  private findNextPixel(pixel: IDimensions): IDimensions {
    for (let i = 0; i < NB_PIXEL_TO_CHECK; i++) {
      const returnedPixel = this.ifPixelExist({width: pixel.width + SEARCH_POSITION_X[i], height: pixel.height + SEARCH_POSITION_Y[i]});
      if ( returnedPixel !== null) {
        return returnedPixel;
      }
    }
    return null as unknown as IDimensions;
  }

  private ifPixelExist(searchPixel: IDimensions): IDimensions {
    const index = this.pixelToChange.findIndex( (pixel) => (pixel.width === searchPixel.width && pixel.height === searchPixel.height) );
    let returnPixel: IDimensions = null as unknown as IDimensions;
    if ( index > INVALID_INDEX ) {
      returnPixel = this.pixelToChange[index];
      this.pixelToChange.splice(index, 1);
    }
    return returnPixel;
  }

  private getAllBorderPixel(event: MouseEvent, acceptedTolerance: number): void {
    const pixelToVerifie: IDimensions[] = [];
    pixelToVerifie.push({width: event.offsetX, height: event.offsetY});

    while ( pixelToVerifie.length > 0) {
      const pixel = pixelToVerifie.pop();
      if (pixel !== undefined) {
        this.floodFill(pixel.width, pixel.height, acceptedTolerance, pixelToVerifie);
      }
    }
  }

  private floodFill(x: number, y: number, acceptedTolerance: number, pixelToVerifie: IDimensions[]): void {
    let isBorderPixel = 0;
    for (let i = 0; i < POSITION_TO_CHECK; i++) {
      if ( this.validPixel(x + PIXEL_X[i], y + PIXEL_Y[i], acceptedTolerance)) {
        isBorderPixel++;
        if (this.checkedPosition[x + PIXEL_X[i]][y + PIXEL_Y[i]] === 0 ) {
          this.checkedPosition[x + PIXEL_X[i]][y + PIXEL_Y[i]] = 1;
          pixelToVerifie.push({width: x + PIXEL_X[i], height: y + PIXEL_Y[i]});
        }
      }
    }
    if (isBorderPixel < IS_NOT_BORDER_PIXEL) {
      this.pixelToChange.push({width: x, height: y});
    }
  }

  private validPixel(x: number, y: number, acceptedTolerance: number): boolean {
    if ( this.inDrawing(x , y) && this.validColor(x, y, acceptedTolerance) ) {
      return true;
    }
    return false;
  }

  private inDrawing(x: number, y: number): boolean {
    if ( x >= 0 && x < this.dimensions.width) {
      if ( y >= 0 && y < this.dimensions.height) {
        return true;
      }
    }
    return false;
  }

  private validColor(x: number, y: number, acceptedTolerance: number): boolean {
    const tolerance = this.colorComparator(this.clickedPixelColor, this.getColor(x, y));
    if ( acceptedTolerance >= tolerance) {
      return true;
    }
    return false;
  }

  private resetArrays(): void {
    this.checkedPosition = new Array(this.dimensions.width);
    for (let i = 0; i < this.dimensions.width; i++) {
      this.checkedPosition[i] = new Array(this.dimensions.height);
    }
    for (let i = 0; i < this.dimensions.width; i++) {
      for (let j = 0; j < this.dimensions.height; j++) {
        this.checkedPosition[i][j] = 0;
      }
    }
    this.pixelToChange = [];
  }

  private getColor(x: number, y: number): Color {
    const imageColor = this.ctx.getImageData(x, y, 1 , 1);
    return new Color(imageColor.data[POSTION_R], imageColor.data[POSTION_G],
      imageColor.data[POSTION_B], imageColor.data[POSTION_A] / MAX_VALUE);
  }

  private colorComparator(color1: Color, color2: Color): number {
    let r =  ( color1.getR() - color2.getR() ) * TURN_IN_PERCENT;
    r = ( r >= 0 ) ? r  : -r ;
    let g =  ( color1.getG() - color2.getG() ) * TURN_IN_PERCENT;
    g = ( g >= 0 ) ? g  : -g ;
    let b =  ( color1.getB() - color2.getB() ) * TURN_IN_PERCENT;
    b = ( b >= 0 ) ? b  : -b ;

    return r + g + b;
  }

}
