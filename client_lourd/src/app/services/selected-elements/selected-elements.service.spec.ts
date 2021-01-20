import { TestBed } from '@angular/core/testing';

import { SelectedElementsService } from './selected-elements.service';

describe('SelectedElementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectedElementsService = TestBed.get(SelectedElementsService);
    expect(service).toBeTruthy();
  });

  it('updateSelectedElements should .next on the behaviourSubject selectedElements', () => {
    const service: SelectedElementsService = TestBed.get(SelectedElementsService);
    spyOn(service.selectedElements, 'next');
    service.updateSelectedElements([]);
    expect(service.selectedElements.next).toHaveBeenCalled();
  });
});
