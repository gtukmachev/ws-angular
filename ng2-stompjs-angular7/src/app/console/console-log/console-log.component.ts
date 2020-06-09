import {Component, Input, OnInit} from '@angular/core';
import {ConsoleItem, SimpleCommandConsoleItem, TextConsoleItem, UnknownCommandConsoleItem} from "../model/console-item";

@Component({
  selector: 'app-console-log',
  templateUrl: './console-log.component.html',
  styleUrls: ['./console-log.component.css']
})
export class ConsoleLogComponent implements OnInit {

  @Input() logs: ConsoleItem[];

  constructor() { }

  ngOnInit(): void {
  }

  textConsoleItem(anItem: ConsoleItem): TextConsoleItem {
    if (anItem.type == "TextConsoleItem") return anItem as TextConsoleItem; return null;
  }

  unknownCommandConsoleItem(anItem: ConsoleItem): UnknownCommandConsoleItem {
    if (anItem.type == "UnknownCommandConsoleItem") return anItem as UnknownCommandConsoleItem; return null;
  }

  simpleCommandConsoleItem(anItem: ConsoleItem): SimpleCommandConsoleItem {
    if (anItem.type == "SimpleCommandConsoleItem") return anItem as SimpleCommandConsoleItem; return null;
  }
}
