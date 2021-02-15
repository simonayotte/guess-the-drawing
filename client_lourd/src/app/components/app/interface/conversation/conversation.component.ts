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

  lobbies: string[] = ["salon 1", "salon2", "failix", "weber"];
  messages: MessageModel[] = [
    {
      messageWriter: "Failix",
      messageIcon: "1",
      messageTime: "14:50:32",
      messageContent: "yo",
    },
    {
      messageWriter: "Weber",
      messageIcon: "2",
      messageTime: "14:50:32",
      messageContent: "Salut",
    },
    {
      messageWriter: "Failix",
      messageIcon: "1",
      messageTime: "14:50:32",
      messageContent: "pret?",
    },
    {
      messageWriter: "Weber",
      messageIcon: "2",
      messageTime: "14:50:32",
      messageContent: "Down",
    },
  ];

  constructor(private webSocketService: WebSocketServiceService) { }

  ngOnInit() {
    this.webSocketService.listen('chatMessage').subscribe((data : string) => {
      let text:MessageModel = {
        messageWriter: "server",
        messageIcon: "5",
        messageTime: "14:55:30",
        messageContent: data,
      }

      this.messages.push(text);
    });
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  }

  public loadEntireConvo() {
    
  }

  public sendMessage(): void {
    let text:MessageModel = {
      messageWriter: "Weber",
      messageIcon: "4",
      messageTime: "14:55:30",
      messageContent: this.message,
    }
    // use push to add a new message
    this.messages.push(text);
    this.webSocketService.emit('chatMessage', this.message);
    this.message = "";
    //get container element

  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } catch(err) { }                 
  }

}
