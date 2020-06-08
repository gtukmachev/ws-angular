import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {Subscription} from 'rxjs';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy  {

  @Input() currentUser: String;

  private topicSubscription: Subscription;
  public receivedMessages: string[] = [];

  constructor(private rxStompService: RxStompService) { }

  ngOnInit(): void {
    this.topicSubscription = this.rxStompService.watch('/topic/chat/messages').subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
    });
  }

  ngOnDestroy(): void {
    this.topicSubscription.unsubscribe();
  }

  submitMessage(messageForm: NgForm) {
    this.rxStompService.publish({destination: '/topic/chat/add', body: messageForm.value.messageText});
  }

}
