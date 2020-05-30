import {Component, OnDestroy, OnInit} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy  {

  private topicSubscription: Subscription;
  public receivedMessages: string[] = [];

  constructor(private rxStompService: RxStompService) { }

  ngOnInit(): void {
    this.topicSubscription = this.rxStompService.watch('/topic/demo').subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
    });
  }

  ngOnDestroy(): void {
    this.topicSubscription.unsubscribe();
  }

  onSendMessage() {
    const message = `Message generated at ${new Date()}`;
    this.rxStompService.publish({destination: '/queue/addmsg', body: message});
  }


}
