import { TestBed } from '@angular/core/testing';
import { LoginService } from '../login/login.service';

import { WebSocketServiceService } from './web-socket.service';

describe('WebSocketService', () => {
  let service: WebSocketServiceService;
  let mockLoginService: LoginService;

  beforeEach(() => {
    mockLoginService = jasmine.createSpyObj('loginService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [{provide: LoginService, useValue: mockLoginService}]
    })
    .compileComponents();
    service = TestBed.inject(WebSocketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
