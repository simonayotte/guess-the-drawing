import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'src/app/services/login/login.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let mockLoginService: LoginService;

    beforeEach(() => {
      mockLoginService = jasmine.createSpyObj('loginService', ['signOut']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
            providers: [{provide: LoginService, useValue: mockLoginService}]
        });
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('LOG2990');
    });
});
