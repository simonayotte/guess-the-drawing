import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { SERVER_BASE } from 'src/app/models/server-data';
import { UserInfoService } from '../data/user-info.service';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: any;
  readonly url: string = SERVER_BASE //modifiez dans models/server-data

  constructor(private userInfo: UserInfoService) {
    this.socket = io(this.url);
  }

  connect(){
    if(this.socket.id === undefined){
      this.socket = io(this.url);
    }

    this.emit('connectSocketid', this.userInfo.getIdplayer());
  }

  disconnect(){
    this.socket.disconnect();
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
  }

}


