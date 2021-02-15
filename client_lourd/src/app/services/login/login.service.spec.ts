import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserModel } from 'src/app/models/user';

import { LoginService, SERVER_BASE, SIGN_IN_ENDPOINT, SIGN_OUT_ENDPOINT, SIGN_UP_ENDPOINT } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let router: Router;
  let navigateSpy: jasmine.Spy;
  const response: UserModel = {
    playerid: 42
  };
  const randomUser = {
    username: 'user',
    password: 'pass',
    email: 'random@mail.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);


    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('signIn should make GET request with the username and password', (done) => {
    service.signIn(randomUser.username, randomUser.password).then((user) => {
      expect(user).toEqual(response);
      expect(service.isUserSignedIn()).toEqual(true);
      expect(service.getCurrentUser()).toEqual(response);
      done();
    });

    const req = httpMock.expectOne(`${SERVER_BASE}${SIGN_IN_ENDPOINT}`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({username: randomUser.username, password: randomUser.password});
    req.flush(response);
    httpMock.verify();
  });

  it('signUp should make POST request with the username, email and password', (done) => {
    service.signUp(randomUser.username, randomUser.email, randomUser.password).then((user) => {
      expect(user).toEqual(response);
      expect(service.isUserSignedIn()).toEqual(true);
      expect(service.getCurrentUser()).toEqual(response);
      done();
    });

    const req = httpMock.expectOne(`${SERVER_BASE}${SIGN_UP_ENDPOINT}`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({username: randomUser.username, email: randomUser.email, password: randomUser.password});
    req.flush(response);
    httpMock.verify();
  });

  it('signOut should make POST request with the username', (done) => {
    service.signIn(randomUser.username, randomUser.password).then((user) => {
      expect(service.getCurrentUser()).toEqual(response);
      service.signOut().then(() => {
        expect(service.isUserSignedIn()).toEqual(false);
        expect(service.getCurrentUser()).toBeNull();
        done();
      });
      const signOutReq = httpMock.expectOne(`${SERVER_BASE}${SIGN_OUT_ENDPOINT}`);
      expect(signOutReq.request.method).toEqual('POST');
      expect(signOutReq.request.body).toEqual({playerid: response.playerid});
      signOutReq.flush({});
      httpMock.verify();
    });
    const signInReq = httpMock.expectOne(`${SERVER_BASE}${SIGN_IN_ENDPOINT}`);
    signInReq.flush(response);
    httpMock.verify();
  });

  it('signIn should redirect to the main menu', (done) => {
    service.signIn(randomUser.username, randomUser.password).then((user) => {
      expect(navigateSpy).toHaveBeenCalledWith(['/menu']);
      done();
    });
    const req = httpMock.expectOne(`${SERVER_BASE}${SIGN_IN_ENDPOINT}`);
    req.flush(response);
    httpMock.verify();
  });

  it('signUp should redirect to the main menu', (done) => {
    service.signUp(randomUser.username, randomUser.email, randomUser.password).then((user) => {
      expect(navigateSpy).toHaveBeenCalledWith(['/menu']);
      done();
    });

    const req = httpMock.expectOne(`${SERVER_BASE}${SIGN_UP_ENDPOINT}`);
    req.flush(response);
    httpMock.verify();
  });

  it('signOut should redirect to the home (login) page', (done) => {
    service.signIn(randomUser.username, randomUser.password).then((user) => {
      service.signOut().then(() => {
        expect(navigateSpy).toHaveBeenCalledWith(['/home']);
        done();
      });
      const signOutReq = httpMock.expectOne(`${SERVER_BASE}${SIGN_OUT_ENDPOINT}`);
      signOutReq.flush({});
      httpMock.verify();
    });
    const signInReq = httpMock.expectOne(`${SERVER_BASE}${SIGN_IN_ENDPOINT}`);
    signInReq.flush(response);
    httpMock.verify();
  });

});
