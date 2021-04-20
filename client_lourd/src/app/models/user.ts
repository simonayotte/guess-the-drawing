// contains the public information of a user
export interface UserModel {
  idplayer: number;
  username: string;
  // email: string;
  avatar: string;
  userChannels: string[];
  appChannels: string[]; // = new Array<string>();
  idSocket: string;
}
