import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentRoute = route.url[0].path;
    const isInLoginPage = currentRoute === 'home';
    const isUserSignedIn = this.loginService.isUserSignedIn();

    // trying to navigate in the app without being logged in
    if(!isUserSignedIn && !isInLoginPage) {
      // redirects to login page
      this.router.navigate(['/home']);
      return false;
    }

    // going to the login page while the user is signed in
    if(isUserSignedIn && isInLoginPage) {
      // signs out the user
      await this.loginService.signOut();
      return false;
    }

    return true;
  }
}
