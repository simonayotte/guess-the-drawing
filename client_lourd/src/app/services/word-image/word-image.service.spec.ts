import { TestBed } from '@angular/core/testing';

import { WordImageService } from './word-image.service';

describe('WordImageService', () => {
  let service: WordImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
