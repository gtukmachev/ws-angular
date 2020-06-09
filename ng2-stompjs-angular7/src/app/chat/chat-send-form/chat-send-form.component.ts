import {Component, Input, OnInit} from '@angular/core';
import {UserServiceService} from "../../services/user-service.service";
import {StompRService} from "@stomp/ng2-stompjs";

@Component({
  selector: 'app-chat-send-form',
  templateUrl: './chat-send-form.component.html',
  styleUrls: ['./chat-send-form.component.css']
})
export class ChatSendFormComponent implements OnInit {

  @Input() chatQueueName: string;

  public messageInputText: string = "";

  constructor(
    private userServiceService: UserServiceService,
    private stompService: StompRService
  ) { }

  ngOnInit(): void {
  }

  submitMessage() {
    this.stompService.publish({destination: this.chatQueueName, body: this.messageInputText});
    this.messageInputText = "";
  }

}
