import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StompRService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {Subscription} from 'rxjs';
import {NgForm} from "@angular/forms";
import {IChatMessage} from "../model/chat-message";

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

  constructor(private _stompService: StompRService) { }

  ngOnInit(): void {
    this.topicSubscription = this._stompService.watch('/topic/chat/messages')
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
    this._stompService.publish({destination: '/topic/chat/add', body: this.messageInputText});
    this.messageInputText = "";
  }

}

