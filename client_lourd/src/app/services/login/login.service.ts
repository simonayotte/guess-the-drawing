import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user';

export const SERVER_BASE = "REPLACE/WITH/SERVER/BASE/URL/";
export const SIGN_IN_ENDPOINT = "REPLACE/WITH/SIGNIN/ENDPOINT";
export const SIGN_UP_ENDPOINT = "REPLACE/WITH/SIGNUP/ENDPOINT";
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
      // uncomment next line once we get the server working
      // catchError(this.handleError)
      // for now:
      catchError(err => {
        console.log(`Sign in GET call to server with username: ${username} and password: ${password}!`);
        const response: UserModel = {username, email: 'some@mail.com', avatar: 'someImageData'};
        this.signedIn(response);
        return of(response);
        // to test an error:
        // return throwError('Mot de passe invalide. Veuillez réessayer.')
      })
    ).toPromise();
  }

  // returns a success message if signed up successfully or an error otherwise
  public async signUp(username: string, email: string, password: string): Promise<UserModel> {
    if(this.isUserSignedIn()) // should not happen but just to be safe
      await this.signOut();

    const postData = {username, email, password};
    return this.http.post<UserModel>(SERVER_BASE + SIGN_UP_ENDPOINT, postData).pipe(
      tap(receivedUser => this.signedIn(receivedUser)),
        // uncomment next line once we get the server working
        // catchError(this.handleError)
        // for now:
        catchError(err => {
        console.log(`Sign up POST call to server with username: ${username}, email: ${email} and password: ${password}!`);
        const response: UserModel = {username, email, avatar: 'someImageData'};
        this.signedIn(response);
        return of(response);
        })
      ).toPromise();
  }

  public signOut(): Promise<void> {
    if(this.currentUser != null) {
      const postData = { username: this.currentUser.username };
      return this.http.post<void>(SERVER_BASE + SIGN_OUT_ENDPOINT, postData).pipe(
        tap(() => {
          this.currentUser = null;
          this.router.navigate(['/home']);
        }),
        // uncomment next line once we get the server working
        // catchError(this.handleError)
        // for now:
        catchError(err => {
          console.log(`Sign out POST call to server!`);
          this.currentUser = null;
          this.router.navigate(['/home']);
          return Promise.resolve();
        })
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

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // Client-side or network error
  //     return throwError('Un problème est survenu lors de la connexion au serveur. Veuillez réessayer.');
  //   } else {
  //     // The server returned an unsuccessful response code. We return the message.
  //     // For example: 'Utilisateur déjà existant' when signing up or 'Mot de passe invalide' when signing in, etc.
  //     return throwError(error.message);
  //   }
  // }
}
