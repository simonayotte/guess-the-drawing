import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user';

export const SERVER_BASE = "http://log3900-server.herokuapp.com/";
export const SIGN_IN_ENDPOINT = "login";
export const SIGN_UP_ENDPOINT = "signup";
export const SIGN_OUT_ENDPOINT = "REPLACE/WITH/SIGNOUT/ENDPOINT";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUser: UserModel | null;

  constructor(private http: HttpClient, private router: Router) { }

  public getCurrentUser(): UserModel | null{
    return this.currentUser;
  }

  public isUserSignedIn(): boolean {
    return this.currentUser != null;
  }

  // returns the user if signed in successfully or an error otherwise
  public async signIn(username: string, password: string): Promise<UserModel> {
    if(this.isUserSignedIn()) // should not happen but just to be safe
      await this.signOut();

    const postData = {username, password};
    return this.http.post<UserModel>(SERVER_BASE + SIGN_IN_ENDPOINT, postData).pipe(
      tap(receivedUser =>  this.signedIn(receivedUser)),
      catchError(this.handleError)
    ).toPromise();
  }

  // returns a success message if signed up successfully or an error otherwise
  public async signUp(username: string, email: string, password: string): Promise<UserModel> {
    if(this.isUserSignedIn()) // should not happen but just to be safe
      await this.signOut();

    const postData = {username, email, password};
    return this.http.post<UserModel>(SERVER_BASE + SIGN_UP_ENDPOINT, postData).pipe(
      tap(receivedUser => this.signedIn(receivedUser)),
      catchError(this.handleError)
      ).toPromise();
  }

  public signOut(): Promise<void> {
    if(this.currentUser != null) {
      const postData = { idplayer: this.currentUser.idplayer };
      this.currentUser = null;
      return this.http.post<void>(SERVER_BASE + SIGN_OUT_ENDPOINT, postData).pipe(
        tap(() => {
          this.router.navigate(['/home']);
        }),
        catchError(this.handleError)
      ).toPromise();
    } else {
      this.router.navigate(['/home']);
      return Promise.resolve();
    }
  }

  private signedIn(userSignedIn: UserModel): void {
    this.currentUser = userSignedIn;
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
