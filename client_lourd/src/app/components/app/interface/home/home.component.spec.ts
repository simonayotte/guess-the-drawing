import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { HomeComponent } from './home.component';

const DIALOG_SERVICE = 'dialogService';
const CONTINUE_DRAWING_SERVICE = 'continueDrawingService';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // onCtrlO()
  it('onCtrlO should call preventDefault and openNewDrawingDialogs', () => {
    const mockCtrlO = new KeyboardEvent('ctrlO');
    spyOn(component, 'openNewDrawingDialogs').and.returnValue();
    spyOn(mockCtrlO, 'preventDefault').and.returnValue();

    component.onCtrlO(mockCtrlO);
    expect(mockCtrlO.preventDefault).toHaveBeenCalled();
    expect(component.openNewDrawingDialogs).toHaveBeenCalled();
  });

  // openNewDrawingDialogs()
  it('openNewDrawingDialogs should call openNewDrawingDialogs from service', () => {
    spyOn(component[DIALOG_SERVICE], 'openNewDrawingDialogs').and.returnValue();

    component.openNewDrawingDialogs();
    expect(component.dialogService.openNewDrawingDialogs).toHaveBeenCalled();
  });

   // openUserGuideDialog()
  it('openUserGuideDialog should call openUserGuideDialog from service', () => {
    spyOn(component[DIALOG_SERVICE], 'openUserGuideDialog').and.returnValue();

    component.openUserGuideDialog();
    expect(component.dialogService.openUserGuideDialog).toHaveBeenCalled();
  });

  // openGallerie()
  it('openGallerie should call openGallerie from service', () => {
    spyOn(component[DIALOG_SERVICE], 'openGallerie').and.returnValue();

    component.openGallerie();
    expect(component.dialogService.openGallerie).toHaveBeenCalled();
  });

  // onCtrlG()
  it('onCtrlG should call preventDefault and openNewDrawingDialogs', () => {
    const onCtrlG = new KeyboardEvent('onCtrlG');
    spyOn(component, 'openGallerie').and.returnValue();
    spyOn(onCtrlG, 'preventDefault').and.returnValue();

    component.onCtrlG(onCtrlG);
    expect(onCtrlG.preventDefault).toHaveBeenCalled();
    expect(component.openGallerie).toHaveBeenCalled();
  });

  // continueDrawing
  it('continueDrawing should call open of continue drawing', () => {
    spyOn(component[CONTINUE_DRAWING_SERVICE], 'open');
    component.continueDrawing();
    expect(component[CONTINUE_DRAWING_SERVICE].open).toHaveBeenCalled();
  });
});
