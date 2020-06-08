import {Component, OnInit} from '@angular/core';
import {StompRService} from "@stomp/ng2-stompjs";

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent implements OnInit {

  constructor(public stompService: StompRService) { }

  ngOnInit(): void {
  }

  logOut() {
    this.stompService.disconnect();
  }

}
