import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogDismissDrawingComponent } from './dialog-dismiss-drawing.component';

const DIALOG_DISMISS_SERVICE = 'dialogDismissService';
const DECISION = true;

describe('DialogDismissDrawingComponent', () => {
  let component: DialogDismissDrawingComponent;
  let fixture: ComponentFixture<DialogDismissDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDismissDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // dismissDecision(boolean)
  it('dismissDecision should call dismissDecision in the service', () => {

    spyOn(component[DIALOG_DISMISS_SERVICE], 'dismissDecision').and.returnValue();

    component.dismissDecision(DECISION);
    expect(component.dialogDismissService.dismissDecision).toHaveBeenCalled();
  });
});
