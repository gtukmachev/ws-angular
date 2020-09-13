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

  static LOGS_EVICTION_PERIOD_SECONDS: number = 0

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
    this.setupEvictionTimer(ConsolePanelComponent.LOGS_EVICTION_PERIOD_SECONDS)
  }

  onCommandSubmit($event: string) {
    if (this.mode == "std") {
      for (let proccessor of this.commandProcessors) {
        let results: ConsoleItem[] = proccessor.parse($event)
        if (results) {
          for (let item of results) {
            this.logs.push(item);
            if (item.type == "SimpleCommandConsoleItem") {
              let cmdObj =  item as SimpleCommandConsoleItem
              let cmd =  cmdObj.command

              if (cmd == "login" || cmd == "join" || cmd == "connect") {
                this.mode = "pwd"
                this.lastConnectCommand = cmdObj
                timer(200).subscribe( _ => this.consoleInputComponent.focusPwd() )

              } else if (cmd == "logout" || cmd == "exit" || cmd == "x") {
                this.disconnectFromChat()

              } else if (cmd == "evict" || cmd == "delay") {
                this.setupEvictionTimer( +cmdObj.args[0] )

              } else if (cmd == "cls" || cmd == "clear") {
                this.logs.length = 0

              } else if (cmd == "help" || cmd == "/?" || cmd == "/") {
                this.printHelp()

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

  setupEvictionTimer(periodSeconds: number) {
    if (this.timerSubscription) this.timerSubscription.unsubscribe()

    if (periodSeconds > 0) {
      let millis = periodSeconds * 1000
      this.timerSubscription =
        timer( millis, millis )
          .subscribe( _ => this.cleanLogs())
      this.logs.push(new TextConsoleItem(`logs eviction = ${periodSeconds} sec`))
    } else {
      this.logs.push(new TextConsoleItem("logs eviction is switched off"))
    }
  }

  connectToChat(cmd: SimpleCommandConsoleItem, passsword: string){
    this.logs.push(new TextConsoleItem("connecting..."))

    function getArg(i: number): string {
      if (i < cmd.args.length) return cmd.args[i]
      return null
    }

    this.chatService.connect(
      getArg(0), // login
      passsword,
      getArg(1), // chat
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
      if (oldness > ConsolePanelComponent.LOGS_EVICTION_PERIOD_SECONDS) {
        this.logs.splice(i,1)
      } else {
        i++
      }
    }

  }

  private printHelp() {
    this.logs.push(new TextConsoleItem("."))
    this.logs.push(new SimpleCommandConsoleItem("join", ["<user-name>", "[<chat-name>]"]))
    this.logs.push(new TextConsoleItem("The command is for joining to a chat."))
    this.logs.push(new TextConsoleItem("Aliases: connect, login"))
    this.logs.push(new TextConsoleItem("."))

    this.logs.push(new SimpleCommandConsoleItem("x", []))
    this.logs.push(new TextConsoleItem("The command for disconnecting out from your current chat."))
    this.logs.push(new TextConsoleItem("Aliases: logout, exit"))
    this.logs.push(new TextConsoleItem("."))

    this.logs.push(new SimpleCommandConsoleItem("cls", []))
    this.logs.push(new TextConsoleItem("remove all logs"))
    this.logs.push(new TextConsoleItem("Aliases: clear"))
    this.logs.push(new TextConsoleItem("."))

    this.logs.push(new SimpleCommandConsoleItem("evict", ["<number-of-seconds>"]))
    this.logs.push(new TextConsoleItem("Configure \"eviction period\" for you chat - a short time period during wich you will see messages."))
    this.logs.push(new TextConsoleItem("After the period is done - messages will disappear, and no one can read it anymore."))
    this.logs.push(new TextConsoleItem("Also, the server do not store messages at all, so it will be impossible to restore it."))
    this.logs.push(new TextConsoleItem("Besides, messages are encrypted, so no server, no anyone except your chat participants can decrypt it."))
    this.logs.push(new TextConsoleItem("Use <number-of-seconds> = 0 to disable eviction"))

    this.logs.push(new TextConsoleItem("Aliases: delay"))
    this.logs.push(new TextConsoleItem("."))

    this.logs.push(new SimpleCommandConsoleItem("help", []))
    this.logs.push(new TextConsoleItem("The command for printing this help message."))
    this.logs.push(new TextConsoleItem("Aliases: /?, /"))
    this.logs.push(new TextConsoleItem("."))
  }
}
