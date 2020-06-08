import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from '@stomp/ng2-stompjs';
import {myRxStompConfig} from './my-rx-stomp.config';
import {MessagesComponent} from './chat/messages/messages.component';
import {ChatPanelComponent} from './chat/chat-panel/chat-panel.component';
import {FormsModule} from "@angular/forms";
import {SimpleMessageComponent} from './chat/simple-message/simple-message.component';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    ChatPanelComponent,
    SimpleMessageComponent
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
