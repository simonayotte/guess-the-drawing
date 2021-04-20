import { UserInfoService } from './../data/user-info.service';
import { BehaviorSubject } from 'rxjs';
import { LobbyList } from './../../models/lobby/lobbyList';
import { Injectable } from '@angular/core';
import { WebSocketService } from '../web-socket/web-socket.service';
import { Lobby } from './../../models/lobby/lobby';
import { UserInfo } from 'src/app/models/lobby/userInfo';


@Injectable({
  providedIn: 'root'
})
export class LobbyService{

  public lobbyList: BehaviorSubject<LobbyList>;
  public activeLobbyID : BehaviorSubject<number>; // Donne le id du lobby dans la liste qu'on active selon le menu principale
  public windowSubscribe: BehaviorSubject<boolean>;
  public windowMode: boolean = false;

  constructor(public webSocket : WebSocketService, private userInfo : UserInfoService) {
    this.lobbyList = new BehaviorSubject<LobbyList>(new LobbyList(new Array<Lobby>()));
    this.activeLobbyID = new BehaviorSubject<number>(-1); // Met a -1 au debut pour lobby inexistant
    this.windowSubscribe = new BehaviorSubject<boolean>(false);
  }

  public requestLobbyList() {
    this.webSocket.emit('lobbyListRequested', {});
  }

  public setActiveLobby(id: number) : void {
    this.activeLobbyID.next(id);
  }

  // Transforme le JSON data de la liste des lobbies en object LobbyList
  public getLobbies(data : any) : void {
    const newLobbies = new Array<Lobby>();
    for (const lobby of data) {
      const id = lobby.id;
      const gamemode = lobby.gamemode;
      const difficulty = lobby.difficulty;
      const players = new Array<UserInfo>();
      for (const player of lobby.players) {
        players.push({id: player.id, name: player.name, avatar: player.avatar});
      }
      const newLobby = new Lobby(id, difficulty, gamemode, players);
      newLobbies.push(newLobby);
    }
    this.lobbyList.next(new LobbyList(newLobbies))
    this.activeLobbyID.next(this.activeLobbyID.value);
  }

  public createLobby(gamemode : string, difficulty: string) : void {
    this.webSocket.emit("lobbyCreated",
    {
      gamemode: gamemode,
      difficulty: difficulty
    });
  }

  // On donne comme argument l'id du lobby
  public joinLobby(id :  number) : void {
    // On quitte l'ancien lobby
    this.windowSubscribe.next(true)
    if (this.lobbyList.value.getLobby(this.lobbyList.value.indexOf(id)).getNumberOfPlayers() < 4) {
      this.webSocket.emit('lobbyPlayerJoined',
      {
        lobbyId: id,
        userId: this.userInfo.getIdplayer(),
        username: this.userInfo.getUsername(),
        avatar: this.userInfo.getAvatar()
      });
    }
  }

  public quitLobby(id :  number) : void {
    this.windowSubscribe.next(true)
    this.webSocket.emit('lobbyPlayerLeft',
    {
      id: id,
      username: this.userInfo.getUsername()
    });
  }

  // TODO : A voir comment on gere cette methode... On pourrait delete le lobby une fois que la partie commence
  public deleteLobby(id :  number) : void {
    this.webSocket.emit('lobbyDeleted',
    {
      id: id
    });
  }


}
