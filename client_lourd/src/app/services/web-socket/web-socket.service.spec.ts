import { TestBed } from '@angular/core/testing';

import { WebSocketServiceService } from './web-socket.service';

describe('WebSocketService', () => {
  let service: WebSocketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
