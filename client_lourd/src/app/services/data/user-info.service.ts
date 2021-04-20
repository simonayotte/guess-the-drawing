import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private userInfo: UserModel = {
    idplayer: 999999,
    username: '',
    avatar: '',
    userChannels: new Array<string>(),
    appChannels: new Array<string>(),
    idSocket: '',
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

  public getChannels(){
    return this.userInfo.userChannels;
  }

  public getAppChannels(){
    return this.userInfo.appChannels;
  }

  public getOtherChannels() {
    return this.userInfo.appChannels.filter(item => this.userInfo.userChannels.indexOf(item) < 0);
  }

  public getIdSocket() {
    return this.userInfo.idSocket;
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

  public setIdSocket(idSocket: string) {
    this.userInfo.idSocket = idSocket;
  }

  public addUserChannel(channel: string){
    this.userInfo.userChannels.push(channel);
  }

  public addUserChannels(channels: string[]){
    for (let channel of channels) {
      this.addUserChannel(channel);
    }
  }

  public deleteAllUserChannels(){
    this.userInfo.userChannels = [];
  }

  public deleteUserChannel(channel: string){
    const index = this.userInfo.userChannels.indexOf(channel);
    if (index > -1) {
      this.userInfo.userChannels.splice(index, 1);
    }
  }

  public addAppChannel(channel: string){
    this.userInfo.appChannels.push(channel);
  }

  public addAppChannels(channels: string[]){
    for (let channel of channels) {
      this.addAppChannel(channel);
    }
  }

  public deleteAllAppChannels(){
    this.userInfo.appChannels = [];
  }

  public deleteAppChannel(channel: string){
    const index = this.userInfo.appChannels.indexOf(channel);
    if (index > -1) {
      this.userInfo.appChannels.splice(index, 1);
    }
  }
}
