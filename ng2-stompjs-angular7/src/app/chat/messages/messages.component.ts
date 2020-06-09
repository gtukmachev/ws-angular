import {Component, Input, OnInit} from '@angular/core';
import {IChatMessage} from "../model/chat-message";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit  {

  @Input() receivedMessages: IChatMessage[] = [];

  constructor( ) { }

  ngOnInit(): void {
  }

}

