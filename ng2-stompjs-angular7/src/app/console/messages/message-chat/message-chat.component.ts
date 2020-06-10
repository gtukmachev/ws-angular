import {Component, Input, OnInit} from '@angular/core';
import {ChatConsoleItem} from "../../model/console-item";

@Component({
  selector: 'app-message-chat',
  templateUrl: './message-chat.component.html',
  styleUrls: ['./message-chat.component.css']
})
export class MessageChatComponent implements OnInit {

  @Input() msg: ChatConsoleItem

  constructor() { }

  ngOnInit(): void {
  }

}
