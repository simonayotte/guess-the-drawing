import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { UserGuideComponent } from './user-guide.component';

const DIALOG = 'dialog';
const USER_GUIDE_SERVICE = 'userGuideService';

describe('UserGuideComponent', () => {
  let component: UserGuideComponent;
  let fixture: ComponentFixture<UserGuideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // previous()
  it('previousDescription should call previous() function from UserGuideService', () => {
    spyOn(component[USER_GUIDE_SERVICE], 'previous').and.returnValue();
    component.previousDescription();

    expect(component[USER_GUIDE_SERVICE].previous).toHaveBeenCalled();

  });

  // next()
  it('nextDescription should call next() function from UserGuideService', () => {
    spyOn(component[USER_GUIDE_SERVICE], 'next').and.returnValue();

    component.nextDescription();
    expect(component[USER_GUIDE_SERVICE].next).toHaveBeenCalled();

  });

  // closeDialog()
  it('closeDialog should call closeAll() function from Matdialog', () => {
    spyOn(component[DIALOG], 'closeAll');

    component.closeDialog();
    expect(component[DIALOG].closeAll).toHaveBeenCalled();

  });

});
