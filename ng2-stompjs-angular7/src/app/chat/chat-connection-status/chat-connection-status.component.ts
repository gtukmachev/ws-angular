import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-connection-status',
  templateUrl: './chat-connection-status.component.html',
  styleUrls: ['./chat-connection-status.component.css']
})
export class ChatConnectionStatusComponent implements OnInit {

  @Input() connectionStatus: number;

  constructor() { }

  ngOnInit(): void {
  }

}
