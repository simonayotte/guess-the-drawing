import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from 'src/app/services/gameServices/game.service';
import { LobbyService } from 'src/app/services/lobby/lobby.service';
@Component({
  selector: 'app-end-game-dialog',
  templateUrl: './end-game-dialog.component.html',
  styleUrls: ['./end-game-dialog.component.scss']
})
export class EndGameDialogComponent{
  gameWon : boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}, private lobbyService: LobbyService, private gameService: GameService) {
    this.gameService.gameWon.subscribe((gameWon : boolean) => {
      this.gameWon = gameWon;
    })
  }
  naviguateToLobbies(): void {
    this.gameService.naviguateToLobbies()
    this.lobbyService.activeLobbyID.next(-1)
  }
}