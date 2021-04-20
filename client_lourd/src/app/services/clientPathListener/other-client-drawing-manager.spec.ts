import { TestBed } from '@angular/core/testing';

import { OtherClientDrawingManager } from './other-client-drawing-manager';

describe('OtherClientDrawingManager', () => {
  let service: OtherClientDrawingManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherClientDrawingManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
