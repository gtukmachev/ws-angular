import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StompRService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {Subscription} from 'rxjs';
import {NgForm} from "@angular/forms";
import {IChatMessage} from "../model/chat-message";
import {UserServiceService} from "../../services/user-service.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy  {

  @Input() currentUser: String;

  private topicSubscription: Subscription;
  public receivedMessages: IChatMessage[] = [];
  messageInputText: string = "";

  constructor(private _stompService: StompRService, private userServiceService: UserServiceService) { }

  ngOnInit(): void {
    let topicName = "/topic/chat/messages/" + this.userServiceService.userPass;
    this.topicSubscription = this._stompService.watch(topicName)
      .subscribe((message: Message) => {
        let chatMessage: IChatMessage;
        try {
          chatMessage = JSON.parse(message.body) as IChatMessage;
          chatMessage.dt = new Date();
        } catch (e) {
          console.log(e)
          chatMessage = {user: "???", msg: "<message unrecognied>", dt: new Date()}
        }

        this.receivedMessages.push(chatMessage);
      });
  }

  ngOnDestroy(): void {
    this.topicSubscription.unsubscribe();
  }

  submitMessage(messageForm: NgForm) {
    let queueName = "/queue/chat/messages/" + this.userServiceService.userPass;
    this._stompService.publish({destination: queueName, body: this.messageInputText});
    this.messageInputText = "";
  }

}

