import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserModel } from 'src/app/models/user';

import { LoginService, SERVER_BASE, SIGN_IN_ENDPOINT, SIGN_UP_ENDPOINT } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  const randomUser: UserModel = {
    username: 'user',
    email: 'random@mail.com',
    avatar: 'avatar.jpg'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('signIn should make GET request with the username and password', () => {
    const password = 'somePassword';
    service.signIn(randomUser.username, password).subscribe((user) => {
      expect(user).toEqual(randomUser);
    });

    const req = httpMock.expectOne(`${SERVER_BASE}${SIGN_IN_ENDPOINT}?username=${randomUser.username}&password=${password}`);
    expect(req.request.method).toEqual('GET');
    req.flush(randomUser);
    httpMock.verify();
  });

  it('signUp should make POST request with the username, email and password', () => {
    const password = 'somePassword';
    service.signUp(randomUser.username, randomUser.email, password).subscribe((user) => {
      expect(user).toEqual('message received');
    });

    const req = httpMock.expectOne(`${SERVER_BASE}${SIGN_UP_ENDPOINT}`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({username: randomUser.username, email: randomUser.email, password: password});
    req.flush('message received');
    httpMock.verify();
  });
});
