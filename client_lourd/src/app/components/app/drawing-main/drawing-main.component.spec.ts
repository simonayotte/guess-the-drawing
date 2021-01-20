import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { DrawingMainComponent } from './drawing-main.component';

describe('DrawingMainComponent', () => {
  let component: DrawingMainComponent;
  let fixture: ComponentFixture<DrawingMainComponent>;
  const DIALOG_DISMIS_SERVICE = 'dialogDismissService';
  const DIALOG_SERVICE = 'dialogService';
  const SCROLLING_SERVICE = 'scrollingService';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
  fixture = TestBed.createComponent(DrawingMainComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // onCtrlO()
  it('onCtrlO should call preventDefault and openNewDrawingDialogs', () => {
    const mockCtrlO = new KeyboardEvent('ctrlO');
    spyOn(component[DIALOG_SERVICE], 'openNewDrawingDialogs').and.returnValue();
    spyOn(mockCtrlO, 'preventDefault').and.returnValue();

    component.onCtrlO(mockCtrlO);
    expect(mockCtrlO.preventDefault).toHaveBeenCalled();
    expect(component.dialogService.openNewDrawingDialogs).toHaveBeenCalled();
  });

  it('onCtrlG should prevent default, call openGallerie of dialogService and .next on dialogDismissService', () => {
    const mockCtrlG = new KeyboardEvent('ctrlG');
    spyOn(component[DIALOG_SERVICE], 'openGallerie');
    spyOn(mockCtrlG, 'preventDefault');
    spyOn(component[DIALOG_DISMIS_SERVICE].dialogToOpenNext, 'next');
    component.onCtrlG(mockCtrlG);
    expect(component.dialogService.openGallerie).toHaveBeenCalled();
    expect(component[DIALOG_DISMIS_SERVICE].dialogToOpenNext.next).toHaveBeenCalled();
    expect(mockCtrlG.preventDefault).toHaveBeenCalled();
  });

  it('onScroll should call .next on scrollPos of scrollingService', () => {
    const mockEvent = new Event('scrool');
    const mockTarget = jasmine.createSpyObj('target', ['scrollLeft', 'scrollTop']);
    spyOnProperty(mockEvent, 'target').and.returnValue(mockTarget);
    spyOn(component[SCROLLING_SERVICE].scrollPos, 'next');
    component.onScroll(mockEvent);
    expect(component[SCROLLING_SERVICE].scrollPos.next).toHaveBeenCalled();
  });

});
