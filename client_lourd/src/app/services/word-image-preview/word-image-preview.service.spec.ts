import { TestBed } from '@angular/core/testing';

import { WordImagePreviewService } from './word-image-preview.service';

describe('WordImagePreviewService', () => {
  let service: WordImagePreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordImagePreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
