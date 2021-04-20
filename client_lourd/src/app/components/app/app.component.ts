import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string>;

    constructor(private loginService: LoginService) {
        this.message = new BehaviorSubject<string>('');
    }

    @HostListener('window:beforeunload', ['$event'])
    public async beforeUnloadHandler(event: Event): Promise<void> {
      // beforeunload doesn't support async http requests.
      // should be able to use navigator.sendBeacon. voir jira GL3H21205-63
      await this.loginService.signOut();
    }
}
