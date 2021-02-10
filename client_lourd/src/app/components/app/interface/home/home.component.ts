import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
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

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
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

  public submit(): void {
    if(this.isLoggingIn)
      this.signIn();
    else
      this.signUp();
  }

  private signIn(): void {
    if(this.loginForm.controls.username.valid && this.loginForm.controls.password.valid) {
      this.loginService.signIn(this.loginForm.controls.username.value,
        this.loginForm.controls.password.value).subscribe(
          // 'draw' will be replaced with the main menu. 'user' param will be accessible from the menu
          res => this.router.navigate(['/draw'], { queryParams: { user: res } }),
          err => this.showDialog(err)
      );

    }
  }

  private signUp(): void {
    if(this.loginForm.valid) {
      this.loginService.signUp(this.loginForm.controls.username.value,
        this.loginForm.controls.email.value,
        this.loginForm.controls.password.value).subscribe(
          res => this.showDialog(res).afterClosed().subscribe(
            () => this.isLoggingIn = true), //sign up successful, going back to sign in
          err => this.showDialog(err)
      );
    }
  }

  private showDialog(message: string): MatDialogRef<BasicDialogComponent, {data: {message: string}}> {
    return this.dialog.open(BasicDialogComponent, { data: {message: message}})
  }
}
