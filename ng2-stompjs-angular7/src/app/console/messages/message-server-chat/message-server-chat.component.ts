import {Component, Input, OnInit} from '@angular/core';
import {ChatConsoleItem} from "../../model/console-item";

@Component({
  selector: 'app-message-server-chat',
  templateUrl: './message-server-chat.component.html',
  styleUrls: ['./message-server-chat.component.css']
})
export class MessageServerChatComponent implements OnInit {

  @Input() msg: ChatConsoleItem

  constructor() { }

  ngOnInit(): void {
  }

}
