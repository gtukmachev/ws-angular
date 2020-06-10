import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ChatConsoleItem,
  ConsoleItem,
  SimpleCommandConsoleItem,
  TextConsoleItem,
  UnknownCommandConsoleItem
} from "../model/console-item";
import {CommandProcessor, SimpleCommandsProcessor} from "../command-processors/command-processor";
import {ChatService} from "../../services/chat.service";
import {IChatMessage} from "../model/chat-message";
import {Message} from "@stomp/stompjs";
import {Subscription, timer} from "rxjs";
import {ConsoleInputComponent} from "../console-input/console-input.component";

@Component({
  selector: 'app-console-panel',
  templateUrl: './console-panel.component.html',
  styleUrls: ['./console-panel.component.css']
})
export class ConsolePanelComponent implements OnInit {

  static LOGS_EVICTION_PERIOD_MILLISECONDS: number = 10000

  logs: ConsoleItem[] = [];
  commandProcessors: CommandProcessor[] = [];
  mode: string = "std";

  lastConnectCommand: SimpleCommandConsoleItem = null;

  private timerSubscription: Subscription

  @ViewChild(ConsoleInputComponent) consoleInputComponent: ConsoleInputComponent;

  constructor(
    private chatService: ChatService
  ){
    this.commandProcessors.push(new SimpleCommandsProcessor())
  }

  ngOnInit(): void {
    this.logs.push( new TextConsoleItem("Welcome to Secure Chat") )
    this.logs.push( new TextConsoleItem("type 'join <name> [<chat>]' to start chatting...") )
    this.timerSubscription = timer(
        ConsolePanelComponent.LOGS_EVICTION_PERIOD_MILLISECONDS, ConsolePanelComponent.LOGS_EVICTION_PERIOD_MILLISECONDS
      ).subscribe( _ => this.cleanLogs())
  }

  onCommandSubmit($event: string) {
    if (this.mode == "std") {
      for (let proccessor of this.commandProcessors) {
        let results: ConsoleItem[] = proccessor.process($event)
        if (results) {
          for (let item of results) {
            this.logs.push(item);
            if (item.type == "SimpleCommandConsoleItem") {
              let cmd =  (item as SimpleCommandConsoleItem).command

              if (cmd == "login" || cmd == "join" || cmd == "connect") {
                this.mode = "pwd";
                this.lastConnectCommand = (item as SimpleCommandConsoleItem);
                timer(200).subscribe( _ => this.consoleInputComponent.focusPwd() )

              } else if (cmd == "logout" || cmd == "exit" || cmd == "x") {
                this.disconnectFromChat()

              }
            }
          }
          return;
        }
      }

      let sendResult = this.chatService.send($event)
      if (!sendResult) {
        this.logs.push(new UnknownCommandConsoleItem($event))
      }

    } else if (this.mode == "pwd") {
      this.mode = "std";
      this.connectToChat(this.lastConnectCommand, $event);
      timer(200).subscribe( _ => this.consoleInputComponent.focusInput() )
    }
  }

  connectToChat(cmd: SimpleCommandConsoleItem, passsword: string){
    this.logs.push(new TextConsoleItem("connecting..."))
    this.chatService.connect(
      cmd.args[0], // login
      cmd.args[1], // chat
      passsword,
      (message: Message) => this.onChatMessageRecieve(message)
    )
  }

  disconnectFromChat(){
    this.logs.push(new TextConsoleItem("disconnecting..."))
    this.chatService.disconnect( () => {
        this.logs.push(new TextConsoleItem("your are disconnected now."))
      });
  }

  private onChatMessageRecieve(incomeMessage: Message) {
    let chatMessage: IChatMessage;
    try {
      chatMessage = JSON.parse(incomeMessage.body) as IChatMessage;
      this.logs.push(new ChatConsoleItem(chatMessage))
    } catch (e) {
      console.log(e)
      this.logs.push(new ChatConsoleItem({user: "???", msg: "message unrecognized"}))
    }
  }

  private cleanLogs() {
    if (this.logs.length == 0) return
    let now: number = new Date().getTime()

    let i = 0; while (i < this.logs.length) {
      const oldness = Math.abs(now - this.logs[i].dt.getTime()) + 1
      if (oldness > ConsolePanelComponent.LOGS_EVICTION_PERIOD_MILLISECONDS) {
        this.logs.splice(i,1)
      } else {
        i++
      }
    }

  }
}
