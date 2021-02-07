import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user';

export const SERVER_BASE = "REPLACE/WITH/SERVER/BASE/URL/";
export const SIGN_IN_ENDPOINT = "REPLACE/WITH/SIGNIN/ENDPOINT";
export const SIGN_UP_ENDPOINT = "REPLACE/WITH/SINGUP/ENDPOINT";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  // returns the user if signed in successfully or an error otherwise
  public signIn(username: string, password: string): Observable<UserModel> {
    const params = new HttpParams().append('username', username).append('password', password);
    return this.http.get<UserModel>(SERVER_BASE + SIGN_IN_ENDPOINT, {params}).pipe(
      // uncomment next line once we get the server working
      // catchError(this.handleError)
      // for now:
      catchError(err => {
        console.log(`Sign in GET call to server with username: ${username} and password: ${password}!`)
        const response: UserModel = {username: username, email: 'some@mail.com', avatar: 'someImageData'}
        return of(response);
        // to test an error:
        //return throwError('Mot de passe invalide. Veuillez réessayer.')
      })
    );
  }

  // returns a success message if signed up successfully or an error otherwise
  public signUp(username: string, email: string, password: string): Observable<string> {
    const postData = {username, email, password};
    return this.http.post<string>(SERVER_BASE + SIGN_UP_ENDPOINT, postData).pipe(
       // uncomment next line once we get the server working
       // catchError(this.handleError)
       // for now:
       catchError(err => {
        console.log(`Sign up POST call to server with username: ${username}, email: ${email} and password: ${password}!`)
        return of('Votre compte a été créé avec succès!');
       })
     );
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // Client-side or network error
  //     return throwError('Un problème est survenu lors de la connexion au serveur. Veuillez réessayer.');
  //   } else {
  //     // The server returned an unsuccessful response code. We return the message.
  //     // For example: 'Utilisateur déjà existant' when signing up or 'Mot de passe invalide' when signing in, etc.
  //     return throwError(error.error);
  //   }
  // }
}
