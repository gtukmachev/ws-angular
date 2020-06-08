import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from '@stomp/ng2-stompjs';
import {myRxStompConfig} from './my-rx-stomp.config';
import {MessagesComponent} from './messages/messages.component';
import {ChatPanelComponent} from './chat/chat-panel/chat-panel.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    ChatPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    { provide: InjectableRxStompConfig, useValue: myRxStompConfig },
    { provide: RxStompService, useFactory: rxStompServiceFactory, deps: [InjectableRxStompConfig] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
