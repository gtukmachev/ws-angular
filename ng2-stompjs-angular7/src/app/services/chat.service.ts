import * as SockJS from 'sockjs-client';
import {Injectable} from '@angular/core';
import {StompRService} from "@stomp/ng2-stompjs";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  topicName: string = "";
  queueName: string = "";
  user: string = "";
  password: string = "";
  chat: string = "";

  private topicSubscription: Subscription;

  constructor(
    private stompService: StompRService
  ) {
  }

  public connect(user: string, chat: string, password: string, messagesHandler: (Message) => void) {
    this.user = user;
    this.chat = chat;
    this.password = password;
    this.topicName = `/topic/chat/messages/${chat}/${password}`
    this.queueName = `/queue/chat/messages/${chat}/${password}`

    if (this.topicSubscription) this.topicSubscription.unsubscribe();
    if (this.stompService.active) this.stompService.disconnect();

    this.stompService.config = {
      url: () => new SockJS("http://127.0.0.1:8080/stomp"),
      headers: {login: user, pass: password},
      heartbeat_in: 0, // Typical value 0 - disabled
      heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
      reconnect_delay: 3000,
      debug: true
    };
    this.stompService.initAndConnect();

    this.topicSubscription = this.stompService
      .watch(this.topicName)
      .subscribe(messagesHandler);
  }

  public send(txt: string): boolean {
    if (this.stompService.active) {
      this.stompService.publish({destination: this.queueName, body: txt});
      return true;
    }
    return false;
  }

  public disconnect(callback: () => void) {
    this.user = ""
    this.chat = ""
    this.password = ""
    this.topicName = ""
    this.queueName = ""
    if (this.topicSubscription) this.topicSubscription.unsubscribe();
    if (this.stompService.active) this.stompService.disconnect();
    callback();
  }

}
