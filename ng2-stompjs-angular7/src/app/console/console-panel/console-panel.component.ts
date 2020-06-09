import {Component, OnInit} from '@angular/core';
import {ConsoleItem, TextConsoleItem, UnknownCommandConsoleItem} from "../model/console-item";
import {CommandProcessor} from "../command-processors/command-processor";

@Component({
  selector: 'app-console-panel',
  templateUrl: './console-panel.component.html',
  styleUrls: ['./console-panel.component.css']
})
export class ConsolePanelComponent implements OnInit {

  logs: ConsoleItem[] = [];
  commandProcessors: CommandProcessor[] = [];

  constructor() {
    //this.commandProcessors.push()
  }

  ngOnInit(): void {
    this.logs.push( new TextConsoleItem("Welcome to Secure Caht") )
    this.logs.push( new TextConsoleItem("type 'login <name>'...") )
  }

  onCommandSubmit($event: string) {
    for (let proccessor of this.commandProcessors) {
      let result = proccessor.process($event)
      if (result) {
        this.logs.push(result)
        return
      }
    }

    this.logs.push( new UnknownCommandConsoleItem($event) )

  }

}
