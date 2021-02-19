import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private userInfo: UserModel = {
    idplayer: 999999,
    username: '',
    avatar: ''
  };

  private connectionStatus: boolean = false;

  public getIdplayer(){
    return this.userInfo.idplayer;
  }

  public getUsername(){
    return this.userInfo.username;
  }

  public getAvatar(){
    return this.userInfo.avatar;
  }

  public getUserInfo(){
    return this.userInfo;
  }

  public isUserConnected(){
    return this.connectionStatus;
  }

  public setIdplayer(idplayer: number){
    this.userInfo.idplayer = idplayer;
  }

  public setUsername(username: string){
    this.userInfo.username = username;
  }

  public setAvatar(avatar: string){
    this.userInfo.avatar = avatar;
  }

  public setConnectionStatus(status: boolean){
    this.connectionStatus = status;
  }

  public setUserInfo(user: UserModel){
    this.userInfo = user;
  }

}
