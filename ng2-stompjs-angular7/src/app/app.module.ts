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
import {ChatSendFormComponent} from './chat/chat-send-form/chat-send-form.component';
import {ConsolePanelComponent} from './console/console-panel/console-panel.component';
import {ConsoleInputComponent} from './console/console-input/console-input.component';
import {ConsoleLogComponent} from './console/console-log/console-log.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    ChatPanelComponent,
    SimpleMessageComponent,
    LoginPanelComponent,
    ChatConnectionStatusComponent,
    ChatSendFormComponent,
    ConsolePanelComponent,
    ConsoleInputComponent,
    ConsoleLogComponent
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
