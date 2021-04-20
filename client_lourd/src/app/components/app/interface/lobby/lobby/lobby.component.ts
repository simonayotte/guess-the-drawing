import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/gameServices/game.service';
import { getDescription } from './../../../../../models/lobby/gameModes';
import { LobbyList } from './../../../../../models/lobby/lobbyList';
import { Lobby } from './../../../../../models/lobby/lobby';
import { LobbyService } from './../../../../../services/lobby/lobby.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { PlayerInfo } from 'src/app/models/gameModels/playerInfo';



@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  public activeLobbyID : number;
  public lobbyList : LobbyList;
  public activeLobby : Lobby;
  public activeLobbyDescription : string;
  public canStart: boolean
  constructor(public lobbyService : LobbyService, public gameService: GameService, private router: Router, private webSocketService: WebSocketService) {
    this.lobbyService.lobbyList.subscribe((lobbyList : LobbyList) => {
      this.lobbyList = lobbyList;
    });

    this.lobbyService.activeLobbyID.subscribe((activeLobbyID : number) => {
      this.activeLobbyID = activeLobbyID;
      if (activeLobbyID !== -1) {
        const index = this.lobbyList.indexOf(activeLobbyID);
        this.activeLobby = this.lobbyList.getLobby(index);
        const gamemode = this.activeLobby.gamemode;
        this.activeLobbyDescription = getDescription(gamemode);
        if(gamemode === "Sprint Solo") {
          this.canStart = this.activeLobby.players.length !== 1
        } else {
          this.canStart = this.activeLobby.players.length < 2
        }
      }
    });

    this.gameService.loadGame.subscribe((value: boolean) => {
      if(value) {
        this.router.navigate(['/draw'])
        this.gameService.loadGame.next(false)
      }
    })
  }

  async ngOnInit() {
    this.webSocketService.listen("gameSetup").subscribe((data: string) => {
      const newPlayers: PlayerInfo[] = JSON.parse(data)
      this.gameService.gameSetupEvent(newPlayers)
    })
    this.webSocketService.listen("loadGame").subscribe(() => {
      this.gameService.inGame.next(true)
      this.lobbyService.windowSubscribe.next(false)
      this.gameService.loadGameEvent()
    })
  }

  startGame(): void {
    this.lobbyService.windowSubscribe.next(false)
    this.gameService.startGame(this.activeLobbyID)
  }
}
