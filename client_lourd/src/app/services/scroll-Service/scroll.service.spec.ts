import { TestBed } from '@angular/core/testing';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrollService = TestBed.get(ScrollService);
    expect(service).toBeTruthy();
  });

  it('updateOffSet should .next on the behaviourSubject scrollPos', () => {
    const service: ScrollService = TestBed.get(ScrollService);
    spyOn(service.scrollPos, 'next');
    service.updateOffSet(0, 0);
    expect(service.scrollPos.next).toHaveBeenCalled();
  });
});
