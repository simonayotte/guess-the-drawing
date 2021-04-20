import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EndGame } from 'src/app/models/gameModels/endGame';
import { GivePoints } from 'src/app/models/gameModels/givePoints';
import { GuessResponseModel } from 'src/app/models/gameModels/guessResponseModel';
import { NewRound } from 'src/app/models/gameModels/newRound';
import { PlayerInfo } from 'src/app/models/gameModels/playerInfo';
import { RoundInfo } from 'src/app/models/gameModels/roundInfo';
import { TimeRemaining } from 'src/app/models/gameModels/timeRemaining';
import { UserInfoService } from 'src/app/services/data/user-info.service';
import { GameService } from 'src/app/services/gameServices/game.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { BasicDialogComponent } from '../interface/basic-dialog/basic-dialog.component';
import { EndGameDialogComponent } from '../interface/end-game-dialog/end-game-dialog.component';
import { InfoDialogComponent } from '../interface/info-dialog/info-dialog.component';

@Component({
  selector: 'app-game-activity',
  templateUrl: './game-activity.component.html',
  styleUrls: ['./game-activity.component.scss']
})
export class GameActivityComponent implements AfterViewInit, OnDestroy, OnInit {
  clientIsArtist: boolean = true
  time: string;
  secretWord: string = "";
  gameWon: boolean;
  artistIdSubscription: Subscription
  private gameSetup: Subscription;
  private newRound: Subscription;
  private rightOfReply: Subscription;
  private updateTime: Subscription;
  private endGame: Subscription;
  private givePoints: Subscription;
  private guessResponse: Subscription;
  private guessResponseIsClose: Subscription;
  private clearDrawing: Subscription;
  private roundInfo: Subscription;

  constructor(public gameService: GameService, private userInfo: UserInfoService, private dialog: MatDialog, private webSocketService: WebSocketService) {
    this.time = ""
    this.gameService.time.subscribe((time: string) => {
      this.time = time
    })
    this.gameService.showRightOfReplyDialog.subscribe((message) => {
      if(message !== "") {
        this.showTimedDialog(message, 5000)
      }
    })
    this.gameService.showEndGameMessage.subscribe((message) => {
      if(message !== "") {
        this.showEndGameDialog(message)
      }
    })
    this.gameService.gameWon.subscribe((gameWon : boolean) => {
      this.gameWon = gameWon;
    })
  }
  ngOnInit(): void {
    this.artistIdSubscription = this.gameService.artistId.subscribe((id) => this.updateDrawingState(id))
    this.gameSetup = this.webSocketService.listen("gameSetup").subscribe((data: string) => {
      const newPlayers: PlayerInfo[] = JSON.parse(data)
      this.gameService.gameSetupEvent(newPlayers)
    })
    this.newRound = this.webSocketService.listen("newRound").subscribe((data: string) => {
      const newRound: NewRound = JSON.parse(data)
      this.gameService.newroundEvent(newRound)
    })
    this.rightOfReply = this.webSocketService.listen("rightOfReply").subscribe(() => {
      this.gameService.rightOfReplyEvent()
    })
    this.updateTime = this.webSocketService.listen("updateTime").subscribe((data: string) => {
      const timeRemaining: TimeRemaining = JSON.parse(data)
      this.gameService.updateTimeEvent(timeRemaining)
    })
    this.endGame = this.webSocketService.listen("endGame").subscribe((data: string) => {
      const endGame: EndGame = JSON.parse(data)
      this.gameService.endGameEvent(endGame)
      this.gameService.inGame.next(false)
    })
    this.givePoints = this.webSocketService.listen("givePoints").subscribe((data: string) => {
      const givePoints: GivePoints = (JSON.parse(data)) as GivePoints
      this.gameService.givePointsEvent(givePoints)
    })
    this.guessResponse = this.webSocketService.listen("guessResponse").subscribe((data: string) => {
      const guessResponse : GuessResponseModel = JSON.parse(data);
      this.gameService.guessResponseEvent(guessResponse)
    })
    this.guessResponseIsClose = this.webSocketService.listen("guessResponseIsClose").subscribe((data: string) => {
      const guessResponse : GuessResponseModel = JSON.parse(data);
      this.gameService.guessResponseIsCloseEvent(guessResponse)
    })
    this.clearDrawing = this.webSocketService.listen("clearDrawing").subscribe(() => {
      this.gameService.clearDrawingEvent()
    })
    this.roundInfo = this.webSocketService.listen("roundInfo").subscribe((data: string) => {
      const model: RoundInfo = JSON.parse(data) as RoundInfo
      this.gameService.roundInfo(model)
    })
  }
  ngOnDestroy(): void {
    this.artistIdSubscription.unsubscribe()
    this.gameSetup.unsubscribe()
    this.newRound.unsubscribe()
    this.rightOfReply.unsubscribe()
    this.updateTime.unsubscribe()
    this.endGame.unsubscribe()
    this.givePoints.unsubscribe()
    this.guessResponse.unsubscribe()
    this.guessResponseIsClose.unsubscribe()
    this.clearDrawing.unsubscribe()
    this.roundInfo.unsubscribe()
  }
  ngAfterViewInit(): void {
    // une fois que la vue est la, on est pret pour la game
    this.gameWon = false
    this.gameService.clientIsReady()
  }

  public readyForNextRound(): void {
    this.gameService.readyForNextRound()
  }

  private updateDrawingState(idArtist: number) {
    this.clientIsArtist = this.userInfo.getIdplayer() === idArtist;
    const word = this.gameService.word.getValue();
    if(this.clientIsArtist) {
      this.secretWord = word;
      this.showDialogBasicDialog("Vous êtes l'artiste, voici votre mot : " + word);
    } else {
      let hiddenWord = " ";
      for(let i = 0; i < word.length; i++) {
        hiddenWord += word.charAt(i) === ' ' ? "   " : "_ ";
      }
      this.secretWord = hiddenWord;
    }
  }

  private showDialogBasicDialog(message: string) {
    this.dialog.closeAll()
    const dialogRef = this.dialog.open(BasicDialogComponent, { data: {message}})
    dialogRef.afterClosed().subscribe(() => {this.gameService.artistIsReady()})
  }

  private showTimedDialog(message: string, timeInMillis: number) : MatDialogRef<InfoDialogComponent, {data: {message: string}}> {
    this.dialog.closeAll()
    const dialogRef = this.dialog.open(InfoDialogComponent, { data: {message}})
    dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        dialogRef.close();
     }, timeInMillis)
    })
    return dialogRef
  }

  private showEndGameDialog(message:string): MatDialogRef<EndGameDialogComponent, {data: {message: string}}> {
    this.dialog.closeAll()
    const dialogRef = this.dialog.open(EndGameDialogComponent, { data: {message}, disableClose: true })
    return dialogRef
  }
}
