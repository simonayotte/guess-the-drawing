import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { UserInfoService } from '../data/user-info.service';


@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  socket: any;
  readonly url: string = 'http://log3900-server.herokuapp.com/';

  constructor(private userInfo: UserInfoService) {
    this.socket = io(this.url);
  }

  connect(){
    if(this.socket.id === undefined){
    this.socket = io(this.url);
    }
    this.socket.on('playerInfo', (data: any) => {
      this.userInfo.setUsername(data.username);
      this.userInfo.setAvatar(data.avatar);
    });
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


