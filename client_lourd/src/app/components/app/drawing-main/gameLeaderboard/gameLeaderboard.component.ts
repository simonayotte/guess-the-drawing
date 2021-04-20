import { Component, OnInit } from '@angular/core';
import { PlayerInfo } from 'src/app/models/gameModels/playerInfo';
import { GameService } from 'src/app/services/gameServices/game.service';
import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'app-gameLeaderboard',
  templateUrl: './gameLeaderboard.component.html',
  styleUrls: ['./gameLeaderboard.component.scss']
})
export class GameLeaderboardComponent implements OnInit {

  players: PlayerInfo[] = [];
  showThumbsUp: boolean = false;
  showThumbsDown: boolean = false;
  constructor(private gameService: GameService, private webSocket: WebSocketService) {
    this.gameService.players.subscribe((newPlayers: PlayerInfo[]) => this.players = newPlayers)
  }

  ngOnInit(): void {
    this.webSocket.listen('thumbsUp').subscribe(async (data : any) =>{
      this.showThumbsUp = true;
      await this.delay(3000);
      this.showThumbsUp = false;
    });
    this.webSocket.listen('thumbsDown').subscribe(async (data : any) =>{
      this.showThumbsDown = true;
      await this.delay(3000);
      this.showThumbsDown = false;
    });
  }

  private async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms));
  }

}
