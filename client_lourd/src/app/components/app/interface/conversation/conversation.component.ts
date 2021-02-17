import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageModel } from 'src/app/models/message';
import { WebSocketServiceService } from 'src/app/services/web-socket/web-socket.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, AfterViewChecked{
  @ViewChild('scrollMe', { static: true }) myScrollContainer: ElementRef;

  public lobbyName: string = "Salon 1";
  public message: string = "";
  public username: string;
  private avatar: string;


  lobbies: string[] = ["salon 1", "salon2", "failix", "weber"];
  messages: MessageModel[] = [];

  constructor(private webSocketService: WebSocketServiceService) { }

  ngOnInit() {
    this.webSocketService.listen('playerInfo').subscribe((data:any) => {
      this.username = data.username;
      this.avatar = data.avatar.toString();
    });

    this.webSocketService.listen('chatMessage').subscribe((data : any) => {
      const text:MessageModel = {
        messageWriter: data.username,
        messageIcon: "assets/avatars/" + data.avatar + ".jpg",
        messageTime: data.time,
        messageContent: data.message,
      };
      this.messages.push(text);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  public loadEntireConvo() {

  }

  public sendMessage(): void {
    if (this.message !== "" && this.message.trim() !== "") {
      const d = new Date();
      const h = `${d.getHours()}`.padStart(2, '0');
      const m = `${d.getMinutes()}`.padStart(2, '0');
      const s = `${d.getSeconds()}`.padStart(2, '0');
      const time = h + ":" + m + ":" + s;

      const text:MessageModel = {
        messageWriter: this.username,
        messageIcon: this.avatar,
        messageTime: time,
        messageContent: this.message,
      };
      // use push to add a new message
      this.messages.push(text);
      this.webSocketService.emit('chatMessage', {message: this.message, username: this.username, avatar: this.avatar, time: time});
      // get container element
    }

    this.message = "";
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } catch(err) {}
  }

}
