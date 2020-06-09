import {Component, OnDestroy, OnInit} from '@angular/core';
import {StompRService} from "@stomp/ng2-stompjs";
import {Subscription} from "rxjs";
import {Message} from "@stomp/stompjs";
import {IChatMessage} from "../model/chat-message";
import {UserServiceService} from "../../services/user-service.service";

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent implements OnInit, OnDestroy {

  chatName: string = "";

  private topicSubscription: Subscription;
  private userSubscription: Subscription;
  public queueName: string = "";
  public receivedMessages: IChatMessage[] = [];

  constructor(
    public stompService: StompRService,
    private userServiceService: UserServiceService
  ) { }

  ngOnInit(): void {
    this.chatName = this.trimChar(location.pathname,"/");

    this.userSubscription = this.userServiceService.pass.subscribe( p => {
        if (p == null) {
            this.queueName = ""
            if (this.topicSubscription) this.topicSubscription.unsubscribe();
            this.receivedMessages.length = 0;
        } else {
            let topicName = "/topic/chat/messages/" + this.chatName + "/" + p;
            this.queueName = "/queue/chat/messages/"+ this.chatName + "/" + p;
            this.topicSubscription = this.stompService
                .watch(topicName)
                .subscribe( message => this.onMessageReceive(message));
        }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.topicSubscription) this.topicSubscription.unsubscribe();
    this.queueName = ""
    this.receivedMessages.length = 0;
  }

  onMessageReceive(incomeMessage: Message) {
    let chatMessage: IChatMessage;
    try {
      chatMessage = JSON.parse(incomeMessage.body) as IChatMessage;
      chatMessage.dt = new Date();
    } catch (e) {
      console.log(e)
      chatMessage = {user: "???", msg: "<message unrecognied>", dt: new Date()}
    }
    this.receivedMessages.push(chatMessage);
  }

  logOut() {
    this.userServiceService.updateUser(null, null);
    this.stompService.disconnect();
  }

  private trimChar(st: string, charToRemove: string) {
    while(st.charAt(0)==charToRemove) {
      st = st.substring(1);
    }

    while(st.charAt(st.length-1)==charToRemove) {
      st = st.substring(0,st.length-1);
    }

    return st;
  }

}
