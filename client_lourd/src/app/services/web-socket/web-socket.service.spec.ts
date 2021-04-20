import { TestBed } from '@angular/core/testing';
import { LoginService } from '../login/login.service';

import { WebSocketService } from './web-socket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockLoginService: LoginService;

  beforeEach(() => {
    mockLoginService = jasmine.createSpyObj('loginService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [{provide: LoginService, useValue: mockLoginService}]
    })
    .compileComponents();
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
