import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../login/login.service';

import { AuthGuardService } from './auth-guard.service';

describe('AuthGardService', () => {
  let service: AuthGuardService;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    mockLoginService = jasmine.createSpyObj('loginService', ['isUserSignedIn', 'signOut']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{provide: LoginService, useValue: mockLoginService}]
    });
    service = TestBed.inject(AuthGuardService);
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should redirect to home (login) page if the user is not signed in', () => {
    mockLoginService.isUserSignedIn.and.returnValue(false);
    const route = new ActivatedRouteSnapshot();
    route.url = [new UrlSegment('menu', {})];
    return service.canActivate(route, {url: 'testUrl'} as RouterStateSnapshot).then(result => {
      expect(result).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    });
  });

  it('should sign out if a connected user is going back to the home (login) page', () => {
    mockLoginService.isUserSignedIn.and.returnValue(true);
    mockLoginService.signOut.and.returnValue(Promise.resolve());
    const route = new ActivatedRouteSnapshot();
    route.url = [new UrlSegment('home', {})];
    return service.canActivate(route, {url: 'testUrl'} as RouterStateSnapshot).then(result => {
      expect(result).toBe(false);
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(mockLoginService.signOut).toHaveBeenCalled();
    });
  });

  it('should return true if a signed in user tries to navigate to a page', () => {
    mockLoginService.isUserSignedIn.and.returnValue(true);
    const route = new ActivatedRouteSnapshot();
    route.url = [new UrlSegment('menu', {})];
    return service.canActivate(route, {url: 'testUrl'} as RouterStateSnapshot).then(result => {
      expect(result).toBe(true);
    });
  });

});
