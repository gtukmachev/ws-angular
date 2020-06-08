import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StompRService} from '@stomp/ng2-stompjs';
import {MessagesComponent} from './chat/messages/messages.component';
import {ChatPanelComponent} from './chat/chat-panel/chat-panel.component';
import {FormsModule} from "@angular/forms";
import {SimpleMessageComponent} from './chat/simple-message/simple-message.component';
import {LoginPanelComponent} from './chat/login-panel/login-panel.component';
import {ChatConnectionStatusComponent} from './chat/chat-connection-status/chat-connection-status.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    ChatPanelComponent,
    SimpleMessageComponent,
    LoginPanelComponent,
    ChatConnectionStatusComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    StompRService
  ],
  /*
  providers: [
    { provide: InjectableRxStompConfig, useValue: myRxStompConfig },
    { provide: RxStompService, useFactory: rxStompServiceFactory, deps: [InjectableRxStompConfig] }
  ],
*/
  bootstrap: [AppComponent]
})
export class AppModule { }
