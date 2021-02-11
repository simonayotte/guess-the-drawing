import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { LoginService } from 'src/app/services/login/login.service';

import { MainMenuComponent } from './main-menu.component';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  let mockLoginService: LoginService;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('loginService', ['signOut']);

    await TestBed.configureTestingModule({
      declarations: [MainMenuComponent],
      imports: [MaterialModule],
      providers: [{provide: LoginService, useValue: mockLoginService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('SignOutClick should sign out', () => {
    mockLoginService.signOut = jasmine.createSpy().and.returnValue(Promise.resolve());
    return component.SignOutClick().then(() =>
      expect(mockLoginService.signOut).toHaveBeenCalled()
    );
  });
});
