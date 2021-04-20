import { EffectsService } from './../effects/effects.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClientIsReadyModel } from 'src/app/models/gameModels/clientIsReadyModel';
import { StartGameInfoModel } from 'src/app/models/gameModels/startGameInfoModel';
import { GivePoints } from 'src/app/models/gameModels/givePoints';
import { NewRound } from 'src/app/models/gameModels/newRound';
import { PlayerInfo, RoleType } from 'src/app/models/gameModels/playerInfo';
import { TimeRemaining } from 'src/app/models/gameModels/timeRemaining';
import { UserInfoService } from '../data/user-info.service';
import { WebSocketService } from '../web-socket/web-socket.service';
import { LobbyService } from '../lobby/lobby.service';
import { CommandInvokerService } from '../drawing/command-invoker.service';
import { GuessModel } from 'src/app/models/gameModels/guessModel';
import { GuessResponseModel } from 'src/app/models/gameModels/guessResponseModel'
import { EndGame } from 'src/app/models/gameModels/endGame';
import { MatDialog } from '@angular/material/dialog';
// import { IdRoomModel } from 'src/app/models/gameModels/idRoomModel';
import { Router } from '@angular/router';
import { BattleRoyalLivesModel, RoundInfo } from 'src/app/models/gameModels/roundInfo';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  inGame: BehaviorSubject<boolean>
  loadGame: BehaviorSubject<boolean>
  time: BehaviorSubject<string> = new BehaviorSubject<string>("00:00")
  players: BehaviorSubject<PlayerInfo[]> = new BehaviorSubject<PlayerInfo[]>([]);
  activeClientInfo: PlayerInfo;
  artistId: BehaviorSubject<number>;
  artistTeamGuessing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  word: BehaviorSubject<string> = new BehaviorSubject<string>("")
  shouldQuitLobby: boolean
  showRightOfReplyDialog: BehaviorSubject<string> = new BehaviorSubject<string>("")
  showEndGameMessage: BehaviorSubject<string> = new BehaviorSubject("")
  newDrawing: BehaviorSubject<boolean> = new BehaviorSubject(false)
  gameWon: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  thumbsEnable = true;
  roundRemaining: number | null
  guessRemaining: number | null
  livesRemaining: BattleRoyalLivesModel | null
  maxRound: number | null
  maxLives: number | null
  maxGuess: number | null
  roundDisplay: string
  livesDisplay: string
  public guessDisplay: string
  guessWord = "";
  constructor(private webSocketService: WebSocketService, public userInfo: UserInfoService,
               private lobbyService: LobbyService, private commandInvoker: CommandInvokerService,
               private effectsService : EffectsService, private dialog: MatDialog, private router: Router) {
    this.guessDisplay = ""
    this.shouldQuitLobby = true
    this.inGame = new BehaviorSubject(false)
    this.artistId = new BehaviorSubject(-1)
    this.loadGame = new BehaviorSubject<boolean>(false)
    this.artistTeamGuessing.subscribe(() => this.updateRoles())

  }
  public readyForNextRound(): void {
    this.webSocketService.emit("readyForNextRound", true)
  }

  public startGame(activeLobby: number): void {
    // TODO: prendre les vrais infos qui vont etre dans lobby
    const gameInfo: StartGameInfoModel = {
      lobbyId: activeLobby
    }
    this.webSocketService.emit("startGame", JSON.stringify(gameInfo));
  }

  public clientIsReady() {
    const clientIsReadyModel: ClientIsReadyModel = {
      userId: this.userInfo.getIdplayer()
    }
    this.webSocketService.emit("clientReadyToStart", JSON.stringify(clientIsReadyModel))
  }

  public artistIsReady() {
    const client: ClientIsReadyModel = {
      userId: this.userInfo.getIdplayer()
    }
    if(this.artistId.getValue() === this.userInfo.getIdplayer()){
      this.webSocketService.emit("artistIsReady", JSON.stringify(client))
    }
  }

  public guess(word: string): void {
    this.guessWord = word;
    const guessModel: GuessModel =  {
      userId: this.userInfo.getIdplayer(),
      guess: word,
      room: this.lobbyService.activeLobbyID.getValue()
    }
    this.webSocketService.emit("guess", JSON.stringify(guessModel))
  }

  public hint(): void {
    this.webSocketService.emit("hint", JSON.stringify({room: this.lobbyService.activeLobbyID}))
  }

  private updateRoles(): void {
    const playingTeam = this.players.value.find(player => player.id === this.artistId.value)?.team
    this.players.value.forEach(player => {
      if(playingTeam !== undefined && player.team === playingTeam) {
        if(player.id === this.artistId.value) {
          player.role = RoleType.Drawing
        } else if(this.artistTeamGuessing.value) {
          player.role = RoleType.Guessing
        } else {
          player.role = RoleType.Watching
        }
      } else {
        if(!this.artistTeamGuessing.value) {
          player.role = RoleType.Guessing
        } else {
          player.role = RoleType.Watching
        }
      }
    })
    this.players.next(this.players.value)
  }

  // Pour l'effet de particule lors d'une victoire.
  public updateGameWon() : void {
    let score = 0
    // Get max score
    this.players.value.forEach(player => {
      if (player.score !== undefined && player.score > score) {
        score = player.score
      }
    })

    const currentPlayer = this.players.value.find(player => player.id === this.userInfo.getIdplayer())
    if (currentPlayer) {
      if (currentPlayer.score !== undefined && currentPlayer.score === score) {
        this.gameWon.next(true)
      }
    } else this.gameWon.next(false)
  }
  public naviguateToLobbies(): void {
    this.router.navigate(['/menu'])
  }

  /////////////// EVENTS //////////////////
  public loadGameEvent() {
    this.artistId.next(-1)
    this.gameWon.next(false)
    this.showEndGameMessage.next("")
    this.showRightOfReplyDialog.next("")
    this.shouldQuitLobby = false
    this.dialog.closeAll()
    this.loadGame.next(true)
  }

  public gameSetupEvent(newPlayers: PlayerInfo[]) {
    this.players.next(newPlayers)
  }

  public newroundEvent(newRound: NewRound) {
    this.word.next(newRound.word)
    this.artistId.next(newRound.artist)
    this.artistTeamGuessing.next(true)
    this.thumbsEnable = true;
  }

  public rightOfReplyEvent() {
    const role = this.players.getValue().find((it) => it.id === this.userInfo.getIdplayer())?.role
    const messageToDisplay =  role === RoleType.Drawing || role === RoleType.Guessing ?
                                            "Vous avez échoué! Droit de réplique à l'autre équipe." :
                                            "L'adversaire à échoué! Vous avez un droit de réplique."
    this.showRightOfReplyDialog.next(messageToDisplay)
    this.artistTeamGuessing.next(false)
    this.guessDisplay = "Guess : Droit de réplique"
  }

  public updateTimeEvent(timeRemaining: TimeRemaining) {
    this.time.next(timeRemaining.time)
  }

  public endGameEvent(endGame: EndGame) {
    this.updateGameWon()
    this.showEndGameMessage.next(endGame.message)
  }

  public givePointsEvent(givePoints: GivePoints) {
    for (let player of this.players.value) {
      for (let i = 0; i < givePoints.players.length; i++ ) {
        if (player.id == givePoints.players[i]) {
          player.score = givePoints.scores[i]
        }
      }
    }
    this.players.next(this.players.value)
  }

  public guessResponseEvent(guessResponse : GuessResponseModel) {
    this.effectsService.playAudio(guessResponse.isGuessCorrect);
  }

  public guessResponseIsCloseEvent(guessResponse : GuessResponseModel) {
    if(!guessResponse.isGuessClose){
      this.webSocketService.emit('chatMessage', {message: this.guessWord, username: this.userInfo.getUsername(), avatar: this.userInfo.getAvatar(), time: '', room: "Lobby " + guessResponse.room, idPlayer: this.userInfo.getIdplayer()});
    }
  }

  public clearDrawingEvent() {
    this.commandInvoker.newDrawing()
    this.newDrawing.next(true)
  }

  public roundInfo(model: RoundInfo) {
    this.maxGuess = model.maxGuess
    this.maxRound = model.maxRound
    this.maxLives = model.maxLife
    this.livesRemaining = model.lifeRemaining
    this.guessRemaining = model.guessRemaining
    this.roundRemaining = model.roundRemaining
    this.livesDisplay = this.livesRemaining !== null ? "Vies : " + this.livesRemaining.lives[this.livesRemaining.players.findIndex(it => it === this.userInfo.getIdplayer())] : ""
    this.roundDisplay = this.maxRound !== null && this.roundRemaining !== null ? "Round : " + this.roundRemaining + " / " + this.maxRound : ""
    this.guessDisplay = this.maxGuess !== null && this.guessRemaining !== null ? "Guess : " + (this.maxGuess - this.guessRemaining) + " / " + this.maxGuess : ""
  }
}
