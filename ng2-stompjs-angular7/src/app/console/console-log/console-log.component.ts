import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {
  ChatConsoleItem,
  ConsoleItem,
  SimpleCommandConsoleItem,
  TextConsoleItem,
  UnknownCommandConsoleItem
} from "../model/console-item";

@Component({
  selector: 'app-console-log',
  templateUrl: './console-log.component.html',
  styleUrls: ['./console-log.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(100)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
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

  chatConsoleItem(anItem: ConsoleItem): ChatConsoleItem {
    if (anItem.type == "ChatConsoleItem") return anItem as ChatConsoleItem; return null;
  }

  serverChatConsoleItem(anItem: ConsoleItem): ChatConsoleItem {
    if (anItem.type == "ServerChatConsoleItem") return anItem as ChatConsoleItem; return null;
  }
}
