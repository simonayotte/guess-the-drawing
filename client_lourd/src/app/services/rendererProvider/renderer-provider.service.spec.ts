import { TestBed } from '@angular/core/testing';

import { RendererProviderService } from './renderer-provider.service';

describe('RendererProviderService', () => {
  let service: RendererProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RendererProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
