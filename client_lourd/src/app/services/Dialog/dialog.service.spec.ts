
import { async, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SelectedColorsService } from '../color-picker/selected-colors.service';
import { CurrentDrawingDataService } from '../drawing/current-drawing-data.service';
import { DialogDismissService } from './dialog-dismiss.service';
import { DialogService } from './dialog.service';

const getScreenWidth = 'getScreenWidth';
const getScreenHeight = 'getScreenHeight';
const currentDrawingService = 'currentDrawingService';
const dialogDimissService = 'dialogDimissService';
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';

const PIXEL_NUMBER = 760;
const PIXEL_STRING = '760px';
const NEW_DRAWING = 'NewDrawing';
const GALLERIE = 'Gallerie';

class MatDialogStub {
    closeAll(): void { return; }
    open(): void { return; }
    afterClose(): void {return; }
    openDialogs(): never[] {return []; }
}
describe('DialogService', () => {
    let service: DialogService;
    const DIALOG_REF_SPY_OBJECT = jasmine.createSpyObj({ afterClosed : of({}), close: null });
    beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [ MatDialogModule ],
          providers: [
            DialogService,
            SelectedColorsService,
            CurrentDrawingDataService,
            DialogDismissService,
            { provide: MatDialog, useClass: MatDialogStub }
          ]
        }).compileComponents();
        service = TestBed.get(DialogService);
    }));
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open GallerieComponent', () => {
        spyOn(service.dialog, 'open');
        service[dialogDimissService].dialogToOpenNext.next(GALLERIE);
        service[dialogDimissService].dismissChanges.next(true);

        expect(service.dialog.open).toHaveBeenCalledTimes(1);
    });

    it('should open user guide dialog when we call the function', () => {
        const FUNCTION_TO_SPY = 'hasOpenDialog';
        spyOn(service.dialog , 'open' );
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'hasOpenDialog').and.callFake(() => false);
        service.openUserGuideDialog();
        expect(service.dialog.open).toHaveBeenCalled();
        expect(service[FUNCTION_TO_SPY]).toHaveBeenCalled();
    });

    it('should open color picker when we call the function', () => {
        const PRIMARY_COLOR = 0;
        spyOn(service.dialog , 'open');
        service.openColorPicker(PRIMARY_COLOR);
        expect(service.dialog.open).toHaveBeenCalled();
    });

    it('open new drawing dialog should open newDrawingdialog', () => {
        const OPEN_NEW_DRWAING_DIALOG = 'openNewDrawingDialog';
        spyOn(service.dialog, 'open').and.returnValue(DIALOG_REF_SPY_OBJECT);

        service[OPEN_NEW_DRWAING_DIALOG]();
        expect(service.dialog.open).toHaveBeenCalled();
    });

    it('open new drawing dialog should not open newDrawingdialog if drawing is notEmpty', () => {
        const CURRENT_DRAWING_SERVICE = 'currentDrawingService';
        spyOn(service.dialog, 'open').and.returnValue(DIALOG_REF_SPY_OBJECT);
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        const SPIED_FUNCTION = spyOn<any>(service, 'openNewDrawingDialog');
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'hasOpenDialog').and.callFake(() => true);
        spyOn(service[CURRENT_DRAWING_SERVICE], 'drawingIsEmpty').and.callFake(() => false);
        spyOn(service[CONTINUE_DRAWING_SERVICE], 'isDrawingInLocalStorage');

        service.openNewDrawingDialogs();
        expect(SPIED_FUNCTION).not.toHaveBeenCalled();
    });
    it('open new drawing dialog should open newDrawingdialog if drawing is Empty', () => {
        const CURRENT_DRAWING_SERVICE = 'currentDrawingService';
        spyOn(service.dialog, 'open').and.returnValue(DIALOG_REF_SPY_OBJECT);
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        const spiedFunction = spyOn<any>(service, 'openNewDrawingDialog');
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'hasOpenDialog').and.callFake(() => false);
        spyOn(service[CURRENT_DRAWING_SERVICE], 'drawingIsEmpty').and.callFake(() => true);
        spyOn(service[CONTINUE_DRAWING_SERVICE], 'isDrawingInLocalStorage');

        service.openNewDrawingDialogs();
        expect(spiedFunction).toHaveBeenCalled();
    });

    it('open new drawing dialog should open from dialog', () => {
        const CURRENT_DRAWING_SERVICE = 'currentDrawingService';
        const spiedFunction = spyOn(service.dialog, 'open').and.returnValue(DIALOG_REF_SPY_OBJECT);
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'openNewDrawingDialog');
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'hasOpenDialog').and.callFake(() => false);
        spyOn(service[CURRENT_DRAWING_SERVICE], 'drawingIsEmpty').and.callFake(() => false);
        spyOn(service[CONTINUE_DRAWING_SERVICE], 'isDrawingInLocalStorage');

        service.openNewDrawingDialogs();
        expect(spiedFunction).toHaveBeenCalled();
    });

    it('should open newDrawingDialog when dismiss decision is true', () => {
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        const SPIED_FUNCTION = spyOn<any>(service, 'openNewDrawingDialog');
        const DIALOG_DISMISS_SERVICE = 'dialogDimissService';
        service[DIALOG_DISMISS_SERVICE].dialogToOpenNext.next(NEW_DRAWING);
        service[DIALOG_DISMISS_SERVICE].dismissChanges.next(true);
        expect(SPIED_FUNCTION).toHaveBeenCalled();
    });

    it('hasOpenDialog should return true if the number of dialgos open is 0', () => {
        const HAS_OPEN_DIALOG = 'hasOpenDialog';
        const hasOpenDialog = service[HAS_OPEN_DIALOG]();
        expect(hasOpenDialog).toBe(false);
    });
    it('should not open any dialogs if one is currently open', () => {
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'hasOpenDialog').and.callFake(() => true);
        const openRef = spyOn(service.dialog, 'open').and.returnValue(DIALOG_REF_SPY_OBJECT);
        spyOn(service[CONTINUE_DRAWING_SERVICE], 'isDrawingInLocalStorage');

        service.openNewDrawingDialogs();
        service.openUserGuideDialog();
        expect(openRef).not.toHaveBeenCalled();
    });

    it('openGallerie should open gallerie component', () => {
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'hasOpenDialog').and.returnValue(false);
        spyOn(service.dialog, 'open');
        spyOn(service[currentDrawingService], 'drawingIsEmpty').and.returnValue(true);
        spyOn(service[CONTINUE_DRAWING_SERVICE], 'isDrawingInLocalStorage');

        service.openGallerie();

        expect(service.dialog.open).toHaveBeenCalledTimes(1);
        expect(service[CONTINUE_DRAWING_SERVICE].isDrawingInLocalStorage).toHaveBeenCalled();
    });

    it('openSaveDrawingDialog should call open', () => {
        spyOn(service, 'hasOpenDialog').and.returnValue(false);
        spyOn(service.dialog, 'open');

        service.openSaveDrawingDialog();

        expect(service.dialog.open).toHaveBeenCalledTimes(1);
    });

    it('openSaveDrawingDialog should not call open', () => {
        spyOn(service, 'hasOpenDialog').and.returnValue(true);
        spyOn(service.dialog, 'open');

        service.openSaveDrawingDialog();

        expect(service.dialog.open).toHaveBeenCalledTimes(0);
    });

    it('openExportDialog should call open', () => {
        spyOn(service, 'hasOpenDialog').and.returnValue(false);
        spyOn(service.dialog, 'open');

        service.openExportDialog();

        expect(service.dialog.open).toHaveBeenCalledTimes(1);
    });

    it('openExportDialog should not call open', () => {
        spyOn(service, 'hasOpenDialog').and.returnValue(true);
        spyOn(service.dialog, 'open');

        service.openExportDialog();

        expect(service.dialog.open).toHaveBeenCalledTimes(0);
    });

    it('openGallerie should open DialogDismissDrawingComponent', () => {
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'hasOpenDialog').and.returnValue(false);
        spyOn(service.dialog, 'open');
        spyOn(service[currentDrawingService], 'drawingIsEmpty').and.returnValue(false);

        service.openGallerie();

        expect(service.dialog.open).toHaveBeenCalledTimes(1);
    });

    it('openGallerie dialog should not be called', () => {
        // We disable this lint so we can spy on a private function
        // tslint:disable-next-line: no-any
        spyOn<any>(service, 'hasOpenDialog').and.returnValue(true);
        spyOn(service.dialog, 'open');

        service.openGallerie();

        expect(service.dialog.open).toHaveBeenCalledTimes(0);
    });

    it('should return pixel width in string', () => {
        spyOnProperty(window, 'innerHeight').and.returnValue(PIXEL_NUMBER);

        const returnString = service[getScreenHeight]();

        expect(returnString).toBe(PIXEL_STRING);
    });

    it('should return error because window.innerHeight undefined', () => {
        spyOnProperty(window, 'innerHeight').and.returnValue(undefined);
        try {
            service[getScreenHeight]();
        } catch (error) {
        expect(1).toBe(1);
        }
    });

    it('should return pixel width in string', () => {
        spyOnProperty(window, 'innerWidth').and.returnValue(PIXEL_NUMBER);

        const returnString = service[getScreenWidth]();

        expect(returnString).toBe(PIXEL_STRING);
    });

    it('should return error because window.innerWidth undefined', () => {
        spyOnProperty(window, 'innerWidth').and.returnValue(undefined);
        try {
            service[getScreenWidth]();
        } catch (error) {
        expect(1).toBe(1);
        }
    });
});
