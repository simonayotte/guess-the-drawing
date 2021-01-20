import { TestBed } from '@angular/core/testing';

import { SelectedToolService } from './selected-tool.service';

describe('SelectedButtonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectedToolService = TestBed.get(SelectedToolService);
    expect(service).toBeTruthy();
  });
});
