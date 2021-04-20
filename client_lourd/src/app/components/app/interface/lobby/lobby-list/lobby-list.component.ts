import { LobbyList } from './../../../../../models/lobby/lobbyList';
import { LobbyService } from './../../../../../services/lobby/lobby.service';
import { difficultyLevels } from '../../../../../models/lobby/difficultyLevels';
import { gameModes } from '../../../../../models/lobby/gameModes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';
import { GameService } from 'src/app/services/gameServices/game.service';

@Component({
  selector: 'app-lobby-list',
  templateUrl: './lobby-list.component.html',
  styleUrls: ['./lobby-list.component.scss']
})
export class LobbyListComponent implements OnInit, OnDestroy {

  public lobbyList: LobbyList;
  public activeLobbyID: number;

  constructor(public dialog: MatDialog, public lobbyService : LobbyService, private webSocket:  WebSocketService, private gameService: GameService) {
    this.lobbyService.lobbyList.subscribe((lobbyList : LobbyList) => {
      this.lobbyList = lobbyList;
    });

    this.lobbyService.activeLobbyID.subscribe((activeLobbyID : number) => {
      this.activeLobbyID = activeLobbyID;
    });
  }

  ngOnInit(): void {
    this.lobbyService.requestLobbyList();

    this.webSocket.listen('lobbyListRequested').subscribe((data : any) => {
      this.lobbyService.getLobbies(data);
    });
  }

  ngOnDestroy() : void {
    if (this.activeLobbyID !== -1 && this.gameService.shouldQuitLobby) {
      this.lobbyService.quitLobby(this.activeLobbyID);
      this.lobbyService.setActiveLobby(-1);
    }
    this.gameService.shouldQuitLobby = true
  }
  // Dialog de creation d'un lobby
  openDialog() : void {

    const dialogRef: MatDialogRef<any> =  this.dialog.open(CreateLobbyDialog, {
      height: '700px',
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }

  // Changer le activeLobbyID de notre service
  joinLobby(id : number) : void {
    if (this.activeLobbyID != -1)
      this.lobbyService.quitLobby(this.activeLobbyID);
    this.lobbyService.joinLobby(id);
    this.lobbyService.setActiveLobby(id);
  }

  // Changer le activeLobbyID de notre service
  leaveLobby() : void {
    if (this.activeLobbyID != -1) {
      this.lobbyService.quitLobby(this.activeLobbyID);
      this.lobbyService.setActiveLobby(-1);
    }
  }

  // Pour déterminer si le joueur est dans le lobby
  // Si on obtient vrai : on change le bouton Rejoindre pour Quitter
  isInLobby(id: number): boolean {
    return this.activeLobbyID === id;
  }

}

// tslint:disable-next-line: max-classes-per-file
@Component({
  selector: 'create-lobby-dialog',
  templateUrl: './create-lobby-dialog.html',
  styleUrls: ['./create-lobby-dialog.scss']
})
export class CreateLobbyDialog {
  gameMode: string;
  difficultyLevel: string;

  difficultyLevels = difficultyLevels;
  gameModes = gameModes;

  constructor(
    public dialogRef: MatDialogRef<CreateLobbyDialog>,
    private lobbyService : LobbyService
  ) { }

  createLobby() : void {
    if(this.gameMode && this.difficultyLevel){
      this.lobbyService.createLobby(this.gameMode, this.difficultyLevel);
    }
  }
}
