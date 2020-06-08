import * as SockJS from 'sockjs-client';
import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {NgForm} from "@angular/forms";
import {StompRService} from "@stomp/ng2-stompjs";

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent implements OnInit {

  login$: Subject<string> = new Subject<string>();
  // userName: String = ""

  constructor(private _stompService: StompRService) {
    this.login$ = new Subject<string>();

    this.login$.subscribe( (userLogin: string) => {
      if (userLogin == null) {
        this._stompService.disconnect();
      } else {
        this._stompService.config = {
          url: () => new SockJS("http://127.0.0.1:8080/stomp"),
          headers: {login: userLogin, pass: 'pass' },
          heartbeat_in: 0, // Typical value 0 - disabled
          heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
          reconnect_delay: 3000,
          debug: true
        };
        this._stompService.initAndConnect();
      }
    });
  }

  ngOnInit(): void {
  }

  onLoginSubmit(loginForm: NgForm) {
    this.login$.next(loginForm.value.userName)
  }

  logOut() {
    this.login$.next(null)
  }

}
