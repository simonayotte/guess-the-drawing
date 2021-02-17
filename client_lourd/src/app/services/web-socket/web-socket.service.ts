import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { LoginService } from 'src/app/services/login/login.service';


@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  socket: any;
  readonly url: string = 'http://log3900-server.herokuapp.com/';

  constructor(private loginService: LoginService) {
    this.socket = io(this.url);
    const user = this.loginService.getCurrentUser();
    if( user != null){
      this.emit('connectSocketid', user.idplayer);
    }
  }


  listen(eventName: string){
    return new Observable((subscriber: any) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }


  emit(eventName: string, data: any) {
    this.socket.emit(eventName,data);
  };

}


