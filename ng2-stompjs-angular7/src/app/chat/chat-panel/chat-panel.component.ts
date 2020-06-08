import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent implements OnInit {

  login$: Subject<String> = new Subject<String>();
  // userName: String = ""

  constructor() {
    this.login$ = new Subject<String>();


  }

  ngOnInit(): void {
  }

  onLoginSubmit(loginForm) {
    this.login$.next(loginForm.value.userName)
  }

  logOut() {
    this.login$.next(null)
  }

}
