import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import * as SockJS from 'sockjs-client';
import {StompRService} from "@stomp/ng2-stompjs";
import {UserServiceService} from "../../services/user-service.service";

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {

  constructor(private stompService: StompRService, private userServiceService: UserServiceService) { }

  ngOnInit(): void {
  }

  onLoginSubmit(loginForm: NgForm) {
    let userName = loginForm.value.userName;
    let password = loginForm.value.userPass;

    this.userServiceService.userName = userName
    this.userServiceService.userPass = password

    if (userName == null) {
      this.stompService.disconnect();

    } else {
      this.stompService.config = {
        url: () => new SockJS("http://127.0.0.1:8080/stomp"),
        headers: {login: userName, pass: password },
        heartbeat_in: 0, // Typical value 0 - disabled
        heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
        reconnect_delay: 3000,
        debug: true
      };
      this.stompService.initAndConnect();
    }
  }

}
