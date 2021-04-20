import { Component } from '@angular/core';
import { GameService } from 'src/app/services/gameServices/game.service';
import { LobbyService } from 'src/app/services/lobby/lobby.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'app-thumbs-up',
  templateUrl: './thumbs-up.component.html',
  styleUrls: ['./thumbs-up.component.scss']
})
export class ThumbsUpComponent {

  constructor(private lobbyService: LobbyService, private webSocketService: WebSocketService, public gameService: GameService) { }

  thumbsUp(){
    this.webSocketService.emit('thumbsUp', JSON.stringify({lobbyId: this.lobbyService.activeLobbyID.getValue(), idplayer: this.gameService.artistId.getValue()}));
    this.gameService.thumbsEnable = false;
  }

  thumbsDown(){
    this.webSocketService.emit('thumbsDown', JSON.stringify({lobbyId: this.lobbyService.activeLobbyID.getValue(), idplayer: this.gameService.artistId.getValue()}));
    this.gameService.thumbsEnable = false;

  }

}
