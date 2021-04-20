import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Input } from '@angular/core';
import { AfterViewChecked, Component, ElementRef, OnInit, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, tap, startWith } from 'rxjs/operators';
import { RoleType } from 'src/app/models/gameModels/playerInfo';
import { MessageModel } from 'src/app/models/message';
import { SERVER_BASE } from 'src/app/models/server-data';
import { UserInfoService } from 'src/app/services/data/user-info.service';
import { GameService } from 'src/app/services/gameServices/game.service';
import { LobbyService } from 'src/app/services/lobby/lobby.service';
import { LoginService } from 'src/app/services/login/login.service';

import { WebSocketService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, AfterViewChecked, OnDestroy{
  @ViewChildren('scrollMe') myScrollContainer:  QueryList<ElementRef>;

  public inGame: boolean = false;
  public url: string;
  public message: string = "";
  public guessMessage: string = "";
  public channel: string = "";
  public chatIsActive: boolean = false;
  public activeChannel: string;
  public messagesAreLoaded = false;
  public canGuess = false;
  public canHint = false;

  findChannelsControl = new FormControl();
  otherChannels: string[];
  filteredChannels: Observable<string[]>;

  channels = new Map<string, MessageModel[]>();
  public channelsKeys: string[] = [];

  public windowURL: string;
  public windowReference: any = null;
  private leaveChannelSubs: Subscription;
  private chatMessageSubs: Subscription;
  private newChannelCreationSubs: Subscription;
  private channelDeletedSubs: Subscription;
  private closeWindowSubs: Subscription;
  private joinChannelLobbySubs: Subscription;
  private toggleChatSubs: Subscription;
  private windowSubs: Subscription;
  private gameSubs: Subscription;

  constructor(private webSocketService: WebSocketService,public userInfo: UserInfoService, private http: HttpClient, public loginService: LoginService, public gameService: GameService, private lobbyService: LobbyService) { }

  async ngOnInit() {
    this.windowURL = window.location.href.toString();
    let dir = __dirname // <!-- COMMENT TO RUN ON WEB -->
    this.url = 'file:///' + dir.replace(/\\/g, "/") + '/#/chat' // <!-- COMMENT TO RUN ON WEB -->

    if (this.windowURL.includes("chat")) {
      let lastItem = this.windowURL.substring(this.windowURL.lastIndexOf('#') + 1)
      await this.loginService.createWindow(lastItem);
      this.lobbyService.windowMode = false;
    }
    this.windowSubs = this.lobbyService.windowSubscribe.subscribe((it) => {
      this.onWindowClose()
    });
    this.gameSubs = this.gameService.inGame.subscribe((it) => {
      this.inGame = it
    });
    this.setOtherChannels()
    for (let channel of this.userInfo.getChannels()) {
      this.addChannel(channel);
    }
    this.filteredChannels = this.findChannelsControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.activeChannel = 'general';
    this.chatMessageSubs = this.webSocketService.listen('chatMessage').subscribe((data : any) => this.addMessage(data));
    this.newChannelCreationSubs = this.webSocketService.listen('newChannelCreation').subscribe((data : any) => {
      this.userInfo.addAppChannel(data.channel);
      this.setOtherChannels();
      this.filteredChannels = this.findChannelsControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    });
    this.channelDeletedSubs = this.webSocketService.listen('channelDeleted').subscribe((data : any) => {
      this.userInfo.deleteAppChannel(data.channel);
      this.setOtherChannels();
      this.filteredChannels = this.findChannelsControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    });
    this.closeWindowSubs = this.webSocketService.listen('closeWindow').subscribe((data : any) => {
      if (!this.lobbyService.windowSubscribe.value) {
        this.onWindowClose()
        this.lobbyService.windowMode = false
      }
      this.lobbyService.windowSubscribe.next(false)
    });
    this.closeWindowSubs = this.webSocketService.listen('reloadParentChannels').subscribe(async (data : any) => {
      await this.loginService.reloadChannels()
      this.channels = new Map<string, MessageModel[]>();
      this.channelsKeys = [];
      this.setOtherChannels()
      
      for (let channel of this.userInfo.getChannels()) {
        this.addChannel(channel);
      }
      this.filteredChannels = this.findChannelsControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
    );
    });
    this.joinChannelLobbySubs = this.webSocketService.listen('joinChannelLobby').subscribe((data : any) => {
      let channelName: string = data.channelName
      this.userInfo.addUserChannel(channelName);
      this.addChannel(channelName);
      this.webSocketService.emit("joinChannelRoom", {channel: channelName});
    });

    this.leaveChannelSubs = this.webSocketService.listen('leaveChannelLobby').subscribe((data : any) => {
      let channelName: string = data.channelName
      this.deleteChannel(channelName);
      this.webSocketService.emit("leaveChannelRoom", {channel: channelName, isChannelDeleted: false});
    });

    this.toggleChatSubs = this.webSocketService.listen('toggleChat').subscribe((data : any) => {
      let lobbyName = "Lobby " + data.lobbyid;
      this.openChannel(lobbyName);
    });
    if(this.inGame) {
      this.gameService.players.subscribe(() => this.updateGuessHintAvailability());
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.onWindowClose();
    
    if (this.windowURL.includes("chat")) {
      this.webSocketService.emit("closeWindow",  {idSocket: this.userInfo.getIdSocket()})
    }

    this.leaveChannelSubs.unsubscribe();
    this.chatMessageSubs.unsubscribe();
    this.newChannelCreationSubs.unsubscribe();
    this.channelDeletedSubs.unsubscribe();
    this.closeWindowSubs.unsubscribe();
    this.joinChannelLobbySubs.unsubscribe();
    this.toggleChatSubs.unsubscribe();
    this.windowSubs.unsubscribe();
    this.gameSubs.unsubscribe();
  }

  public switchWindowMode(): void {
    if (this.windowURL.includes("chat")) {
      this.webSocketService.emit("closeWindow", {idSocket: this.userInfo.getIdSocket()})
    }
    if (this.windowReference===null) {
      this.openWindow()
    }
    else {
      this.onWindowClose();
      this.lobbyService.windowMode = false;
    }
  }

  public openWindow(): void {
    let route = 'file://' + __dirname + '/index.html#/chat#' + this.userInfo.getIdplayer().toString(); // <!-- COMMENT TO RUN ON WEB -->
    this.windowReference = window.open(route, 'chat', 'toolbar=0, width=330, height=500'); // <!-- COMMENT TO RUN ON WEB -->
    this.lobbyService.windowMode = true;
  }

  public async onWindowClose() {
    if (this.windowReference !== null) {
      this.windowReference.close();
      await this.loginService.createWindow(this.userInfo.getIdplayer().toString());
    }
    this.windowReference=null;
  }

  public async loadEntireConvo() {
    this.http.post<any>(SERVER_BASE + "messages/history",{channel: this.activeChannel}).pipe(
      tap(data =>  {
        this.channels.set(this.activeChannel, []);
        for(let message of data.history){
          this.addMessage(message);
        }
      }),
      catchError(this.handleError)
    ).toPromise();
    this.scrollToBottom();
    this.messagesAreLoaded = true;
  }

  private addChannel(channel: string) {
    this.channels.set(channel, []);
    this.channelsKeys.push(channel);
  }

  private addMessage(dataMessage: any) {
    const text:MessageModel = {
      messageWriter: dataMessage.username,
      messageIcon: "assets/avatars/" + dataMessage.avatar + ".jpg",
      messageTime: dataMessage.time,
      messageContent: dataMessage.message,
    };
    this.channels.get(dataMessage.room)?.push(text);
  }

  public toggleChat(chat: boolean): void {
    chat ? this.chatIsActive = true : this.chatIsActive = false;
  }

  public createChannel(channelName: string): void {
    if(channelName != null && channelName !== "" && channelName.slice(0, 5) !== "Lobby"){
      if (this.otherChannels.includes(channelName)) {
        this.http.post<any>(SERVER_BASE + "channel/join",{channel: channelName, idplayer: this.userInfo.getIdplayer()}).pipe(
          tap(data =>  {
            this.userInfo.addUserChannel(channelName);
            this.addChannel(channelName);
            this.webSocketService.emit("joinChannelRoom", {channel: channelName});
            this.setOtherChannels();
            this.filteredChannels = this.findChannelsControl.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value))
            );
          }),
          catchError(this.handleError)
        ).toPromise();
      }
      else {
        this.http.post<any>(SERVER_BASE + "channel/create",{channel: channelName, idplayer: this.userInfo.getIdplayer()}).pipe(
          tap(data =>  {
            this.userInfo.addUserChannel(channelName);
            this.addChannel(channelName);
            this.webSocketService.emit("newChannelCreation", {channel: channelName});
          }),
          catchError(this.handleError)
        ).toPromise();
      }
    }
    this.channel = "";
    this.webSocketService.emit("reloadParentChannels", {idSocket: this.userInfo.getIdSocket()})
  }


  public openChannel(channel: string): void {
    this.activeChannel = channel;
    this.messagesAreLoaded = false;
    this.loadEntireConvo()
    this.toggleChat(true);
  }

  public quitChannel(channel: string): void {
    if(channel !== "general"){
      this.http.post<any>(SERVER_BASE + "channel/leave",{channel: channel, idplayer: this.userInfo.getIdplayer()}).pipe(
        tap(data => {
          this.webSocketService.emit("leaveChannelRoom", {channel: channel, isChannelDeleted: data.isChannelDeleted});
          this.deleteChannel(channel);
          this.setOtherChannels();
          this.filteredChannels = this.findChannelsControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        }),
        catchError(this.handleError)
      ).toPromise();
    }
    this.webSocketService.emit("reloadParentChannels", {idSocket: this.userInfo.getIdSocket()})
  }

  private deleteChannel(channel: string){
    this.userInfo.deleteUserChannel(channel);
    this.channels.delete(channel);
    let index = this.channelsKeys.indexOf(channel)
    if (index > -1){
      this.channelsKeys.splice(index, 1)
    }
    this.activeChannel = this.channelsKeys[this.channelsKeys.length - 1]
  }

  public sendMessage(): void {
    if (this.message !== "" && this.message.trim() !== "") {
      this.webSocketService.emit('chatMessage', {message: this.message, username: this.userInfo.getUsername(), avatar: this.userInfo.getAvatar(), time: '', room: this.activeChannel, idPlayer: this.userInfo.getIdplayer()});
    }
    this.message = "";
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.first.nativeElement.scroll({
        top: this.myScrollContainer.first.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } catch(err) {}
  }

  public guess(): void {
    if (this.canGuess) {
      this.gameService.guess(this.guessMessage);
    }
    this.guessMessage = "";
  }

  public hint(): void {
    if (this.canHint) {
      // this.gameService.hint();
      this.webSocketService.emit("hint", {room: this.lobbyService.activeLobbyID.value});
    }
  }

  private updateGuessHintAvailability() {
    const currentPlayer = this.gameService.players.value.find(player => player.id === this.userInfo.getIdplayer());
    if(currentPlayer !== undefined && currentPlayer.role === RoleType.Guessing) {
      this.canGuess = true;
      this.canHint = true;
    } else {
      this.canGuess = false;
      this.canHint = false;
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status !== 401 || error instanceof ErrorEvent) {
      // Client-side or network error
      return throwError('Un problème est survenu lors de la connexion au serveur. Veuillez réessayer.');
    } else {
      // The server returned an unsuccessful response code. We return the message.
      // For example: 'Utilisateur déjà existant' when signing up or 'Mot de passe invalide' when signing in, etc.
      return throwError(error.error.message);
    }
  }

  private _filter(value: string): string[] {

    this.setOtherChannels();
    const filterValue = value.toLowerCase();

    return this.otherChannels.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private setOtherChannels() {
    this.otherChannels = this.userInfo.getOtherChannels();
  }
}
