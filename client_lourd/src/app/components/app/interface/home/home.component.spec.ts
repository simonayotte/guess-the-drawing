import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { UserModel } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login/login.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockLoginService: LoginService;
  let mockDialog: MatDialog;

  const validUser: UserModel = {
    username: 'user',
    email: 'random@mail.com',
    avatar: 'avatar.jpg'
  };

  const validPassword = 'pass';
  const signUpMessage = 'Votre compte a été créé avec succès!';

  beforeEach((() => {
    mockLoginService = jasmine.createSpyObj('loginService', ['signIn', 'signUp', 'signOut']);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppModule, MatDialogModule],
      providers: [{provide: LoginService, useValue: mockLoginService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockLoginService = TestBed.inject(LoginService);
    mockLoginService.signIn = jasmine.createSpy().and.returnValue(Promise.resolve(validUser));
    mockLoginService.signUp = jasmine.createSpy().and.returnValue(Promise.resolve(signUpMessage));
    mockLoginService.signOut = jasmine.createSpy().and.returnValue(Promise.resolve());
    mockDialog = TestBed.inject(MatDialog);
    mockDialog.open = jasmine.createSpy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empty values should be invalid and prevent signing in', () => {
    component.loginForm.controls.username.setValue('');
    component.loginForm.controls.email.setValue('');
    component.loginForm.controls.password.setValue('');
    component.submit();

    expect(component.loginForm.valid).toBeFalsy();
    expect(component.loginForm.controls.username.valid).toBeFalsy();
    expect(component.loginForm.controls.email.valid).toBeFalsy();
    expect(component.loginForm.controls.password.valid).toBeFalsy();
    expect(component.getErrorMessage(component.loginForm.controls.username)).toBe('Le champ ne doit pas être vide');
    expect(mockLoginService.signIn).not.toHaveBeenCalled();
  });

  it('wrong email format should be invalid and prevent signing up', () => {
    component.loginForm.controls.username.setValue(validUser.username);
    component.loginForm.controls.email.setValue('mail');
    component.loginForm.controls.password.setValue(validPassword);
    component.isLoggingIn = false;
    component.submit();

    expect(component.loginForm.valid).toBeFalsy();
    expect(component.loginForm.controls.username.valid).toBeTruthy();
    expect(component.loginForm.controls.email.valid).toBeFalsy();
    expect(component.loginForm.controls.password.valid).toBeTruthy();
    expect(component.getErrorMessage(component.loginForm.controls.email)).toBe('L\'adresse entrée n\'est pas valide');
    expect(mockLoginService.signIn).not.toHaveBeenCalled();
  });

  it('non-empty values should be valid', () => {
    component.loginForm.controls.username.setValue(validUser.username);
    component.loginForm.controls.email.setValue(validUser.email);
    component.loginForm.controls.password.setValue(validPassword);

    expect(component.loginForm.valid).toBeTruthy();
    expect(component.loginForm.controls.username.valid).toBeTruthy();
    expect(component.loginForm.controls.email.valid).toBeTruthy();
    expect(component.loginForm.controls.password.valid).toBeTruthy();
  });

  it('submitting the form to sign in should call the service with the right values', () => {
    component.loginForm.controls.username.setValue(validUser.username);
    component.loginForm.controls.password.setValue(validPassword);

    component.submit();

    expect(mockLoginService.signIn).toHaveBeenCalledTimes(1);
    expect(mockLoginService.signIn).toHaveBeenCalledWith(validUser.username, validPassword);
  });

  it('submitting the form to sign up should call the service with the right values', () => {
    component.loginForm.controls.username.setValue(validUser.username);
    component.loginForm.controls.email.setValue(validUser.email);
    component.loginForm.controls.password.setValue(validPassword);
    component.isLoggingIn = false;
    component.submit();

    expect(mockLoginService.signUp).toHaveBeenCalledTimes(1);
    expect(mockLoginService.signUp).toHaveBeenCalledWith(validUser.username, validUser.email, validPassword);
  });

  it('receiving a sign in error from the service should show it in a dialog', () => {
    const errorMessage = "some error message";
    mockLoginService.signIn = jasmine.createSpy().and.returnValue(Promise.reject(errorMessage));
    component.loginForm.controls.username.setValue(validUser.username);
    component.loginForm.controls.password.setValue(validPassword);

    return component.submit().then(() =>
      expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), { data: {message: errorMessage}})
    );
  });

  it('receiving a sign up error from the service should show it in a dialog', () => {
    const errorMessage = "some error message";
    mockLoginService.signUp = jasmine.createSpy().and.returnValue(Promise.reject(errorMessage));
    component.loginForm.controls.username.setValue(validUser.username);
    component.loginForm.controls.email.setValue(validUser.email);
    component.loginForm.controls.password.setValue(validPassword);
    component.isLoggingIn = false;

    return component.submit().then(() =>
      expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), { data: {message: errorMessage}})
    );
  });

  it('toggleDisplay should switch between signing in and signing up', () => {
    expect(component.isLoggingIn).toBeTruthy();

    component.toggleDisplay();
    expect(component.isLoggingIn).toBeFalsy();

    component.toggleDisplay();
    expect(component.isLoggingIn).toBeTruthy();
  });

});
