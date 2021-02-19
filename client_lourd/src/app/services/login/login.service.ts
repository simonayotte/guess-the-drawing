import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user';
import { UserInfoService } from '../data/user-info.service';
import { WebSocketServiceService } from '../web-socket/web-socket.service';

export const SERVER_BASE = "http://log3900-server.herokuapp.com/";
export const SIGN_IN_ENDPOINT = "login";
export const SIGN_UP_ENDPOINT = "signup";
export const SIGN_OUT_ENDPOINT = "REPLACE/WITH/SIGNOUT/ENDPOINT";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router, private userInfo: UserInfoService, private webSocekt: WebSocketServiceService) { }


  // returns the user if signed in successfully or an error otherwise
  public async signIn(username: string, password: string): Promise<UserModel> {
    if(this.userInfo.isUserConnected()) // should not happen but just to be safe
      this.signOut();

    const postData = {username, password};
    return this.http.post<UserModel>(SERVER_BASE + SIGN_IN_ENDPOINT, postData).pipe(
      tap(receivedUser =>  this.signedIn(receivedUser)),
      catchError(this.handleError)
    ).toPromise();
  }

  // returns a success message if signed up successfully or an error otherwise
  public async signUp(username: string, email: string, password: string): Promise<UserModel> {
    if(this.userInfo.isUserConnected()) // should not happen but just to be safe
      this.signOut();

    const postData = {username, email, password};
    return this.http.post<UserModel>(SERVER_BASE + SIGN_UP_ENDPOINT, postData).pipe(
      tap(receivedUser => this.signedIn(receivedUser)),
      catchError(this.handleError)
      ).toPromise();
  }

  public signOut(){
    if(this.userInfo.isUserConnected() !== false) {
      this.userInfo.setConnectionStatus(false);
      this.webSocekt.disconnect();
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  private signedIn(userSignedIn: UserModel): void {
    this.userInfo.setIdplayer(userSignedIn.idplayer);
    this.userInfo.setConnectionStatus(true);
    this.webSocekt.connect();
    this.router.navigate(['/menu']); // go to main menu
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
