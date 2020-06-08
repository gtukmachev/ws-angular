import {Component, Input, OnInit} from '@angular/core';
import {IChatMessage} from "../model/chat-message";

@Component({
  selector: 'app-simple-message',
  templateUrl: './simple-message.component.html',
  styleUrls: ['./simple-message.component.css']
})
export class SimpleMessageComponent implements OnInit {

  @Input() msg: IChatMessage;

  constructor() { }

  ngOnInit(): void {
  }

}
