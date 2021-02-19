import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserInfoService } from '../data/user-info.service';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router, private userInfo: UserInfoService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentRoute = route.url[0].path;
    const isInLoginPage = currentRoute === 'home';
    const isUserSignedIn = this.userInfo.isUserConnected();
    

    // trying to navigate in the app without being logged in
    if(!isUserSignedIn && !isInLoginPage) {
      // redirects to login page
      this.router.navigate(['/home']);
      return false;
    }

    // going to the login page while the user is signed in
    if(isUserSignedIn && isInLoginPage) {
      // signs out the user
      this.loginService.signOut();
      return false;
    }

    return true;
  }
}
