import { TestBed } from '@angular/core/testing';
import { SelectedColorsService } from '../color-picker/selected-colors.service';
import { ContinueDrawingService } from '../continue-drawing/continue-drawing.service';
import { DrawingSizeService } from '../drawing/drawing-size.service';
import { GallerieDrawingService } from '../gallerie-services/gallerie-drawing/gallerie-drawing.service';
import { SvgService } from '../svg-service/svg.service';
import { DialogDismissService } from './dialog-dismiss.service';

const NEXT = 'next';
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';

describe('DialogDismissService', () => {
  const mockContinueDrawing = new ContinueDrawingService(
    new GallerieDrawingService(), new DrawingSizeService(), new SelectedColorsService(), new SvgService());

  const service =  new DialogDismissService(mockContinueDrawing);

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // dismissDecision(decision: boolean)
  it('dismissDecision should call dismissChanges.next', () => {
    const decision = true;
    spyOn(service.dismissChanges, NEXT);
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'clear');
    spyOn(service[CONTINUE_DRAWING_SERVICE], 'open');

    service.dismissDecision(decision);

    expect(service.dismissChanges.next).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].clear).toHaveBeenCalled();
    expect(service[CONTINUE_DRAWING_SERVICE].open).toHaveBeenCalled();
  });

  it('dismissDecision should call dismissChanges.next', () => {
    const decision = false;
    spyOn(service.dismissChanges, NEXT);

    service.dismissDecision(decision);

    expect(service.dismissChanges.next).toHaveBeenCalled();
  });

});
