import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SERVER_BASE } from 'src/app/models/server-data';
import { UserModel } from 'src/app/models/user';
import { UserInfoService } from '../data/user-info.service';
import { LobbyService } from '../lobby/lobby.service';
import { WebSocketService } from '../web-socket/web-socket.service';


export const SIGN_IN_ENDPOINT = "login";
export const SIGN_UP_ENDPOINT = "signup";
export const SIGN_OUT_ENDPOINT = "REPLACE/WITH/SIGNOUT/ENDPOINT";
export const NEW_WINDOW_ENDPOINT = "login/createWindow";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router, private userInfo: UserInfoService, private webSocket: WebSocketService, private lobbyService: LobbyService) { }


  // returns the user if signed in successfully or an error otherwise
  public async signIn(username: string, password: string): Promise<UserModel> {
    if(this.userInfo.isUserConnected()) // should not happen but just to be safe
      this.signOut();

    const postData = {username, password};
    return this.http.post<UserModel>(SERVER_BASE + SIGN_IN_ENDPOINT, postData).pipe(
      tap(receivedUser =>  this.signedIn(receivedUser, username)),
      catchError(this.handleError)
    ).toPromise();
  }

  // returns a success message if signed up successfully or an error otherwise
  public async signUp(username: string, email: string, password: string, lastName: string, firstName: string): Promise<UserModel> {
    if(this.userInfo.isUserConnected()) // should not happen but just to be safe
      this.signOut();

    const postData = {username, email, password, lastName, firstName};
    return this.http.post<UserModel>(SERVER_BASE + SIGN_UP_ENDPOINT, postData).pipe(
      tap(receivedUser => this.signedIn(receivedUser, username, true)),
      catchError(this.handleError)
      ).toPromise();
  }

  public signOut(){
    this.lobbyService.windowMode = false
    if(this.userInfo.isUserConnected() !== false) {
      this.userInfo.setConnectionStatus(false);
      this.webSocket.disconnect();
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  private signedIn(userSignedIn: any, username: string, signUp: boolean = false): void {
    this.userInfo.setIdplayer(userSignedIn.idplayer);
    this.userInfo.setAvatar(userSignedIn.avatar);
    this.userInfo.setUsername(username);
    this.userInfo.deleteAllUserChannels();
    this.userInfo.addUserChannels(userSignedIn.userChannels);
    this.userInfo.deleteAllAppChannels();
    this.userInfo.addAppChannels(userSignedIn.appChannels);
    this.userInfo.setConnectionStatus(true);
    this.webSocket.connect();
    for (let channelName of userSignedIn.userChannels){
      this.webSocket.emit("joinChannelRoom", {channel: channelName});
    }
    if (signUp) {
      this.router.navigate(['/guide']); // go to main menu
    }
    else {
      this.router.navigate(['/menu']); // go to main menu
    }
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

  public async signInNewWindow(username: string, password: string): Promise<UserModel> {
    if(this.userInfo.isUserConnected()) // should not happen but just to be safe
      this.signOut();

    const postData = {username, password};
    return this.http.post<UserModel>(SERVER_BASE + SIGN_IN_ENDPOINT, postData).pipe(
      tap(receivedUser =>  this.signedIn(receivedUser, username)),
      catchError(this.handleError)
    ).toPromise();
  }

  public async createWindow(idPlayer: string): Promise<void> {

    await this.http.post<UserModel>(SERVER_BASE + NEW_WINDOW_ENDPOINT, {idplayer:idPlayer}).pipe(
      tap(receivedUser =>  {
        this.userInfo.setIdplayer(receivedUser.idplayer);
        this.userInfo.setAvatar(receivedUser.avatar);
        this.userInfo.setUsername(receivedUser.username);
        this.userInfo.deleteAllUserChannels();
        this.userInfo.addUserChannels(receivedUser.userChannels);
        this.userInfo.deleteAllAppChannels();
        this.userInfo.addAppChannels(receivedUser.appChannels);
        this.userInfo.setIdSocket(receivedUser.idSocket)
        this.webSocket.connect();
        for (let channelName of receivedUser.userChannels){
          this.webSocket.emit("joinChannelRoom", {channel: channelName});
        }
      }),
      catchError(this.handleError)
    ).toPromise();
  }

  public async reloadChannels(): Promise<void> {
    const idPlayer = this.userInfo.getIdplayer()
    await this.http.post<UserModel>(SERVER_BASE + NEW_WINDOW_ENDPOINT, {idplayer:idPlayer}).pipe(
      tap(receivedUser =>  {
        this.userInfo.deleteAllUserChannels();
        this.userInfo.addUserChannels(receivedUser.userChannels);
        this.userInfo.deleteAllAppChannels();
        this.userInfo.addAppChannels(receivedUser.appChannels);
        for (let channelName of receivedUser.userChannels){
          this.webSocket.emit("joinChannelRoom", {channel: channelName});
        }
      }),
      catchError(this.handleError)
    ).toPromise();
  }
}
