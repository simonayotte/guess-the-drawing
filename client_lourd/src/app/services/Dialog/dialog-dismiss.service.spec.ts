import { TestBed } from '@angular/core/testing';
import { DialogDismissService } from './dialog-dismiss.service';

const NEXT = 'next';

describe('DialogDismissService', () => {
  const service =  new DialogDismissService();

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // dismissDecision(decision: boolean)
  it('dismissDecision should call dismissChanges.next', () => {
    const decision = true;
    spyOn(service.dismissChanges, NEXT);

    service.dismissDecision(decision);

    expect(service.dismissChanges.next).toHaveBeenCalled();
  });

  it('dismissDecision should call dismissChanges.next', () => {
    const decision = false;
    spyOn(service.dismissChanges, NEXT);

    service.dismissDecision(decision);

    expect(service.dismissChanges.next).toHaveBeenCalled();
  });

});
