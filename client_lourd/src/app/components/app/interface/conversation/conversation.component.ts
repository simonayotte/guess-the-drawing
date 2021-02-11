import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageModel } from 'src/app/models/message';

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
      messageId: "1",
      text: "yo",
      hour: "14:50:32",
      writerId: "Failix",
    },
    {
      messageId: "2",
      text: "hey",
      hour: "14:51:32",
      writerId: "Me",
    },
    {
      messageId: "3",
      text: "pret pour la game?",
      hour: "14:53:32",
      writerId: "Failix",
    },
    {
      messageId: "3",
      text: "pret pour la game?",
      hour: "14:53:32",
      writerId: "Failix",
    },
    {
      messageId: "3",
      text: "lorem ipsum et tout le blablbalbablblab fdfsd  dsfsdfsd fdsf   sdfsdfsdf sdf sdf  sdf sdfsdf ",
      hour: "14:53:32",
      writerId: "Failix",
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  }

  public loadEntireConvo() {
    
  }

  public sendMessage(): void {
    let text:MessageModel = {
      messageId: "4",
      text: this.message,
      hour: "14:55:30",
      writerId: "Me"
    }
    // use push to add a new message
    this.messages.push(text);
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
