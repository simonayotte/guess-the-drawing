import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login/login.service';
import { BasicDialogComponent } from '../basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public hidePassword: boolean = true;
  public isLoggingIn: boolean = true;
  readonly signInText: string = "Se connecter";
  readonly signUpText: string = "S'inscrire";

  public loginForm : FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });
  }

  public toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  public getErrorMessage(control: AbstractControl): string {
    if(control.hasError('required'))
      return 'Le champ ne doit pas être vide';
    else if(control.hasError('email'))
      return 'L\'adresse entrée n\'est pas valide';

    return '';
  }

  public async submit(): Promise<void> {
    if(this.isLoggingIn)
      return this.signIn();
    else
      return this.signUp();
  }

  private async signIn(): Promise<void> {
    if(this.loginForm.controls.username.valid && this.loginForm.controls.password.valid) {
      await this.loginService.signIn(this.loginForm.controls.username.value,
      this.loginForm.controls.password.value).catch(err => {
        this.showDialog(err);
      });
    }
  }

  private async signUp(): Promise<void> {
    if(this.loginForm.valid) {
      await this.loginService.signUp(this.loginForm.controls.username.value,
        this.loginForm.controls.email.value,
        this.loginForm.controls.password.value,
        this.loginForm.controls.firstName.value,
        this.loginForm.controls.lastName.value).catch(err => {
          this.showDialog(err);
        });
    }
  }

  private showDialog(message: string): MatDialogRef<BasicDialogComponent, {data: {message: string}}> {
    return this.dialog.open(BasicDialogComponent, { data: {message}});
  }
}
