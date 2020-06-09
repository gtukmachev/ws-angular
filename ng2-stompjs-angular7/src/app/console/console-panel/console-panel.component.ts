import {Component, OnInit} from '@angular/core';
import {ConsoleItem, TextConsoleItem, UnknownCommandConsoleItem} from "../model/console-item";
import {CommandProcessor, SimpleCommandsProcessor} from "../command-processors/command-processor";

@Component({
  selector: 'app-console-panel',
  templateUrl: './console-panel.component.html',
  styleUrls: ['./console-panel.component.css']
})
export class ConsolePanelComponent implements OnInit {

  logs: ConsoleItem[] = [];
  commandProcessors: CommandProcessor[] = [];

  constructor() {
    this.commandProcessors.push(new SimpleCommandsProcessor())
  }

  ngOnInit(): void {
    this.logs.push( new TextConsoleItem("Welcome to Secure Chat") )
    this.logs.push( new TextConsoleItem("type 'join <name> [<chat>]' to start chatting...") )
  }

  onCommandSubmit($event: string) {
    for (let proccessor of this.commandProcessors) {
      let results: ConsoleItem[] = proccessor.process($event)
      if (results) {
        for(let item of results) this.logs.push(item);
        return;
      }
    }

    this.logs.push( new UnknownCommandConsoleItem($event) )

  }

}
