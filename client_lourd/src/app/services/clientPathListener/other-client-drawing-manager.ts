import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebSocketService } from '../web-socket/web-socket.service'
import { RendererProviderService } from '../rendererProvider/renderer-provider.service'
import { PathDrawingService } from '../tools/path-drawing/path-drawing.service'
import { FirstPointModel } from '../../models/PathCommunicationModels/firstPointModel';
import { MiddlePointModel } from '../../models/PathCommunicationModels/middlePointModel';
import { LastPointModel } from '../../models/PathCommunicationModels/lastPointModel'
import { PathToEraseModel } from '../../models/PathCommunicationModels/pathToEraseModel'
import { DrawingSizeService } from '../drawing/drawing-size.service'
import { CommandInvokerService } from '../drawing/command-invoker.service'
import { DrawCommand } from '../../components/app/command/draw-command'
import { EraserCommand } from '../../components/app/command/eraser-command'
import { LobbyService } from '../lobby/lobby.service';
const CLIENT_LEGER_CANVAS_WIDTH: number = 1026
const CLIENT_LEGER_CANVAS_HEIGHT: number = 681
@Injectable({
  providedIn: 'root'
})
export class OtherClientDrawingManager {
  otherClientPath: BehaviorSubject<SVGPathElement>
  pathToErase: BehaviorSubject<SVGPathElement>
  private pathid: number
  private path: SVGPathElement
  private pathString: string
  private drawingPath: Map<number, SVGPathElement>
  private canvasHeight: number
  private canvasWidth: number
  private heightRatio:number
  private widthRatio:number
  constructor(private socketService: WebSocketService, private rendererProvider: RendererProviderService,
              private pathDrawingService: PathDrawingService, private drawingSizeService: DrawingSizeService,
              private commandInvoker: CommandInvokerService, private lobbyService: LobbyService) {
    this.pathid = 0;
    this.otherClientPath = new BehaviorSubject(this.path);
    this.pathToErase = new BehaviorSubject(this.path);
    this.drawingPath = new Map();
    this.drawingSizeService.heightBS.subscribe((height) => {
      this.canvasHeight = height;
    })
    this.drawingSizeService.widthBS.subscribe((width) => {
      this.canvasWidth = width
    })
    this.commandInvoker.sendCommand.subscribe((cmd) => {
      if(cmd === "undo"){
        this.sendUndoCommand()
      } else if ( cmd === "redo") {
        this.sendRedoCommand()
      }
    })
    this.socketService.listen('firstPoint').subscribe((data : any) => {
      let dataFirstPoint: FirstPointModel = JSON.parse(data)
      this.widthRatio = this.canvasWidth / CLIENT_LEGER_CANVAS_WIDTH
      this.heightRatio = this.canvasHeight / CLIENT_LEGER_CANVAS_HEIGHT
      this.path = this.rendererProvider.getRendererInstance().createElement('path', 'svg');
      let webThickness = this.convertAndroidThicknessToWeb(dataFirstPoint.thickness)
      this.pathDrawingService.setBasicAttributes(this.path, webThickness, dataFirstPoint.color,  'none');
      this.rendererProvider.getRendererInstance().setAttribute(this.path, 'stroke-linecap', 'round');
      this.rendererProvider.getRendererInstance().setAttribute(this.path, 'stroke-linejoin', 'round');
      let coords = this.androidToWebPointResize(dataFirstPoint.point[0], dataFirstPoint.point[1])
      this.pathString = this.pathDrawingService.initializePathString(coords.x, coords.y);
      this.pathString += this.pathDrawingService.lineCreatorString(coords.x, coords.y);
      this.pathDrawingService.setPathString(this.path, this.pathString);
      this.otherClientPath.next(this.path)
    });
    this.socketService.listen('middlePoint').subscribe((data:any) => {
      let middlePoint: MiddlePointModel = JSON.parse(data)
      let coords = this.androidToWebPointResize(middlePoint.point[0], middlePoint.point[1])
      this.drawLine(coords.x, coords.y)
      this.otherClientPath.next(this.path)

    })
    this.socketService.listen('lastPoint').subscribe((data:any) => {
      let lastPoint: LastPointModel = JSON.parse(data)
      let coords = this.androidToWebPointResize(lastPoint.point[0], lastPoint.point[1])
      this.drawLine(coords.x, coords.y)
      this.otherClientPath.next(this.path)
      this.drawingPath.set(lastPoint.pathId, this.path)
      this.commandInvoker.addCommand(new DrawCommand(this.path))
    })
    this.socketService.listen('erasePath').subscribe((data:any) => {
      const pathToEraseModel: PathToEraseModel = JSON.parse(data)
      let pathMap = new Map<number, SVGPathElement>()
      for(let id of pathToEraseModel.pathId) {
        let pathToErase = this.drawingPath.get(id)
        if( pathToErase != undefined){
          pathMap.set(id, pathToErase)
          this.pathToErase.next(pathToErase)
        }
      }
      this.commandInvoker.addCommand(new EraserCommand(Array.from(pathMap.values())))
    })
    this.socketService.listen('undo').subscribe(() => {
      this.commandInvoker.undo(true)
    })
    this.socketService.listen('redo').subscribe(() => {
      this.commandInvoker.redo(true)
    })
  }
  private androidToWebPointResize(x:number, y:number): DOMPoint {
    return new DOMPoint(x * this.widthRatio, y * this.heightRatio)
  }
  private webToAndroidPointResize(x:number, y:number) {
    return [x/this.widthRatio, y/this.heightRatio]
  }
  private drawLine(x: number, y: number) {
    this.pathString += this.pathDrawingService.lineCreatorString(x, y);
    this.pathDrawingService.setPathString(this.path, this.pathString);
  }
  private convertWebThicknessToAndroid(webThickness:number) {
    const androidThickness = (webThickness/ (this.canvasHeight * this.canvasWidth)) * (CLIENT_LEGER_CANVAS_HEIGHT * CLIENT_LEGER_CANVAS_WIDTH)
    return Math.round(androidThickness)
  }
  private convertAndroidThicknessToWeb(androidThickness: number) {
    const webThickness = (androidThickness/(CLIENT_LEGER_CANVAS_WIDTH * CLIENT_LEGER_CANVAS_HEIGHT)) * (this.canvasWidth * this.canvasHeight)
    return Math.round(webThickness)
  }
  private findPathId(pathToFind:SVGPathElement): number | null {
    for (let [id, path] of this.drawingPath.entries()) {
      if(path == pathToFind){
        return id
      }
    }
    return null
  }
  sendFirstPoint(thicknessValue: number, colorValue: string, pointValue: Array<number>) {
    this.widthRatio = this.canvasWidth / CLIENT_LEGER_CANVAS_WIDTH
    this.heightRatio = this.canvasHeight / CLIENT_LEGER_CANVAS_HEIGHT
    const firstPointModel: FirstPointModel = {
      thickness: this.convertWebThicknessToAndroid(thicknessValue),
      point: this.webToAndroidPointResize(pointValue[0], pointValue[1]),
      color: colorValue,
      room: this.lobbyService.activeLobbyID.getValue()
    }
    this.socketService.emit("firstPoint", JSON.stringify(firstPointModel))
  }

  sendMiddlePoint(pointValue: Array<number>) {
    const middlePointModel: MiddlePointModel = {
      point: this.webToAndroidPointResize(pointValue[0], pointValue[1]),
      room: this.lobbyService.activeLobbyID.getValue()
    }
    this.socketService.emit("middlePoint", JSON.stringify(middlePointModel))
  }

  sendLastPoint(pointValue: Array<number>, path: SVGPathElement) {
    const lastPointModel: LastPointModel = {
      pathId: this.pathid,
      point: this.webToAndroidPointResize(pointValue[0], pointValue[1]),
      room: this.lobbyService.activeLobbyID.getValue()
    }
    JSON.stringify(lastPointModel)
    this.drawingPath.set(this.pathid++, path)
    this.socketService.emit("lastPoint", JSON.stringify(lastPointModel))
  }

  sendPathToErase(paths: SVGPathElement[]) {
    let pathIds: number[] = []
    for(let path of paths) {
      let id: number | null = this.findPathId(path)
      if(id != null){
        pathIds.push(id)
      }
    }
    if(pathIds.length !== 0){
      const pathToEraseModel: PathToEraseModel = { pathId: pathIds, room: this.lobbyService.activeLobbyID.getValue() }
      this.socketService.emit("erasePath", JSON.stringify(pathToEraseModel))
    }
  }
  sendUndoCommand() {
    const undoRedoModel = {
      room: this.lobbyService.activeLobbyID.getValue()
    }
    this.socketService.emit("undo", JSON.stringify(undoRedoModel))
  }
  sendRedoCommand() {
    const undoRedoModel = {
      room: this.lobbyService.activeLobbyID.getValue()
    }
    this.socketService.emit("redo", JSON.stringify(undoRedoModel))
  }
}
