import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {

  socket: any;
readonly url: string = 'http://localhost:4000';

  constructor() {
    this.socket = io(this.url);
  }


  listen(eventName: string){
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }


  emit(eventName: string, data: any) {
    this.socket.emit(eventName,data);
  };

}


