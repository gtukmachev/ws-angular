import {Component, OnInit} from '@angular/core';
import {ConsoleItem, SimpleCommandConsoleItem, TextConsoleItem, UnknownCommandConsoleItem} from "../model/console-item";
import {CommandProcessor, SimpleCommandsProcessor} from "../command-processors/command-processor";
import {ChatService} from "../../services/chat.service";
import {IChatMessage} from "../../chat/model/chat-message";
import {Message} from "@stomp/stompjs";

@Component({
  selector: 'app-console-panel',
  templateUrl: './console-panel.component.html',
  styleUrls: ['./console-panel.component.css']
})
export class ConsolePanelComponent implements OnInit {

  logs: ConsoleItem[] = [];
  commandProcessors: CommandProcessor[] = [];
  mode: string = "std";

  lastConnectCommand: SimpleCommandConsoleItem = null;

  constructor(
    private chatService: ChatService
  ){
    this.commandProcessors.push(new SimpleCommandsProcessor())
  }

  ngOnInit(): void {
    this.logs.push( new TextConsoleItem("Welcome to Secure Chat") )
    this.logs.push( new TextConsoleItem("type 'join <name> [<chat>]' to start chatting...") )
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
    }
  }

  connectToChat(cmd: SimpleCommandConsoleItem, passsword: string){
    this.logs.push(new TextConsoleItem("connecting..."))
    this.chatService.connect(
      cmd.args[0],
      cmd.args[1],
      passsword,
      (message: Message) => this.onChatMessageRecieve(message)
    )

  }

  private onChatMessageRecieve(incomeMessage: Message) {
    let chatMessage: IChatMessage;
    try {
      chatMessage = JSON.parse(incomeMessage.body) as IChatMessage;
      this.logs.push(new TextConsoleItem(chatMessage.user + ": " + chatMessage.msg))
    } catch (e) {
      console.log(e)
      this.logs.push(new TextConsoleItem("???: message unrecognized"))
    }
  }
}
