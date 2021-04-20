import { AfterViewInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SERVER_BASE } from 'src/app/models/server-data';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface LeaderboardElement {
  username: string;
  position: number;
  totalPoints: number;
  victories: number;
  classicVictories: number;
  brVictories: number;
  bestScoreSprintSolo: number;
  bestScoreCoop: number;
  gamesPlayed: number;
  likes: number;
  dislikes: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements AfterViewInit  {

  displayedColumns: string[] = ["position", 'username', 'victories', 'totalPoints',  'classicVictories','brVictories', 'bestScoreSprintSolo','bestScoreCoop', 'gamesPlayed', 'likes', 'dislikes'];
  dataSource = new MatTableDataSource();
  sortedData: LeaderboardElement[];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) {
  }


  async ngAfterViewInit(){
    await this.getStats();
    this.dataSource.sort = this.sort;
  }

  public async getStats(): Promise<void> {

    await this.http.post<any>(SERVER_BASE + "leaderboard/getStats",{}).pipe(
        tap(data =>  {
          const stats = data.stats;
          let i = 0;
          for (const person of stats){
            const leaderboardElement: LeaderboardElement = {
              position: ++i,
              username: person.username,
              totalPoints: +person.totalpoints,
              victories: +person.victories,
              classicVictories: +person.classicvictories,
              brVictories: +person.brvictories,
              bestScoreSprintSolo: +person.bestscoresprintsolo,
              bestScoreCoop: +person.bestscorecoop,
              gamesPlayed: +person.gamesplayed,
              likes:+person.likes,
              dislikes:+person.dislikes
            }
            this.dataSource.data.push(leaderboardElement);
          }
        }),
        catchError(this.handleError)
      ).toPromise()
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 401 || error instanceof ErrorEvent) {
      // Client-side or network error
      return throwError('Un problème est survenu lors de la connexion au serveur. Veuillez réessayer.');
    } else {
      // The server returned an unsuccessful response code. We return the message.
      // For example: 'Utilisateur déjà existant' when signing up or 'Mot de passe invalide' when signing in, etc.
      return throwError(error.error.message);
    }
  }
}

