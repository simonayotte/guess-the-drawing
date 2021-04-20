import { UserGameHistory } from './../../models/profile/game-history';
import { UserLoginHistory } from './../../models/profile/login-history';
import { UserStatistics } from './../../models/profile/statistics';
import { UserIdentity } from './../../models/profile/user-identity';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SERVER_BASE } from 'src/app/models/server-data';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserInfoService } from '../data/user-info.service';
import { BehaviorSubject } from 'rxjs';

//TODO : Add endpoints
export const IDENTITY_ENDPOINT = "profile/identity"
export const STATS_ENDPOINT = "profile/statistics"
export const LOGIN_HISTORY_ENDPOINT = "profile/loginhistory"
export const GAME_HISTORY_ENDPOINT = "profile/gamehistory"

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  public userGameHistoryList : BehaviorSubject<Array<UserGameHistory>>
  public userLoginHistoryList : BehaviorSubject<Array<UserLoginHistory>>
  public userStatistics : BehaviorSubject<UserStatistics>
  public userIdentity : BehaviorSubject<UserIdentity>
  public idplayer : number
  
  constructor(private http: HttpClient, private userInfoService: UserInfoService) {
    this.userGameHistoryList = new BehaviorSubject(new Array<UserGameHistory>())
    this.userLoginHistoryList = new BehaviorSubject(new Array<UserLoginHistory>())
    this.userStatistics = new BehaviorSubject<UserStatistics>({
      gamePlayed: 0,
      winRate: 0,
      averageTimePerGame: "",
      totalTimePlayed: "",
      bestScoreSprintSolo: 0,
      likes: 0,
      dislikes: 0
    })
    this.userIdentity = new BehaviorSubject<UserIdentity>({
      firstName: "",
      lastName: "",
      email:"",
      avatar:""
    });

    this.idplayer = this.userInfoService.getIdplayer();
  }
  
  async getGameHistory() : Promise<Array<UserGameHistory>> {
    console.log("Getting user profile game history from the server...")
    const postData = {idplayer : this.idplayer}
    return this.http.post<Array<UserGameHistory>>(SERVER_BASE + GAME_HISTORY_ENDPOINT, postData).pipe(
      tap(receivedGameHistoryList => this.updateGameHistory(receivedGameHistoryList)),
      catchError(this.handleError)
    ).toPromise();
  }

  private updateGameHistory(receivedGameHistoryList : any) : void {
    this.userGameHistoryList.next(receivedGameHistoryList);
  }

  async getLoginHistory() : Promise<Array<UserLoginHistory>> {
    console.log("Getting user profile loginHistory from the server...")
    const postData = {idplayer : this.idplayer}
    return this.http.post<Array<UserLoginHistory>>(SERVER_BASE + LOGIN_HISTORY_ENDPOINT, postData).pipe(
      tap(receivedLoginHistoryList => this.updateLoginHistory(receivedLoginHistoryList)),
      catchError(this.handleError)
    ).toPromise();
  }

  private updateLoginHistory(receivedLoginHistory : any) : void {
    this.userLoginHistoryList.next(receivedLoginHistory)
  }

  async getStats() : Promise<UserStatistics> {
    console.log("Getting user profile statistics from the server...")
    const postData = {idplayer : this.idplayer}
    return this.http.post<UserStatistics>(SERVER_BASE + STATS_ENDPOINT, postData).pipe(
      tap(receivedStats => this.updateStats(receivedStats)),
      catchError(this.handleError)
    ).toPromise();
  }

  private updateStats(receivedStats : any) : void {
    this.userStatistics.next(receivedStats);
  }

  async getUserIdentity() : Promise<UserIdentity> {
    // Get firstName, lastName and email from server
    const postData = {idplayer : this.idplayer}
    return this.http.post<UserIdentity>(SERVER_BASE + IDENTITY_ENDPOINT, postData).pipe(
      tap(receivedIdentity => this.updateUserIdentity(receivedIdentity)),
      catchError(this.handleError)
    ).toPromise();
  }

  private updateUserIdentity(receivedIdentity: any) : void {
    this.userIdentity.next(receivedIdentity);
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status !== 401 || error instanceof ErrorEvent) {
      return throwError('Un problème est survenu lors de la connexion au serveur. Veuillez réessayer.');
    } else {
      return throwError(error.error.message);
    }
  }



}
