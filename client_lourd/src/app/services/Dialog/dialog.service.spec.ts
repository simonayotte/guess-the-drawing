
import { async, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SelectedColorsService } from '../color-picker/selected-colors.service';
import { CurrentDrawingDataService } from '../drawing/current-drawing-data.service';
import { DialogDismissService } from './dialog-dismiss.service';
import { DialogService } from './dialog.service';

class MatDialogStub {
    closeAll(): void { return; }
    open(): void { return; }
    afterClose(): void {return; }
    openDialogs(): never[] {return []; }
}
describe('DialogService', () => {
    let service: DialogService;
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


    it('should open color picker when we call the function', () => {
        const PRIMARY_COLOR = 0;
        spyOn(service.dialog , 'open');
        service.openColorPicker(PRIMARY_COLOR);
        expect(service.dialog.open).toHaveBeenCalled();
    });

    it('hasOpenDialog should return true if the number of dialgos open is 0', () => {
        const HAS_OPEN_DIALOG = 'hasOpenDialog';
        const hasOpenDialog = service[HAS_OPEN_DIALOG]();
        expect(hasOpenDialog).toBe(false);
    });

});
