import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {StompRService} from '@stomp/ng2-stompjs';
import {FormsModule} from "@angular/forms";
import {ConsolePanelComponent} from './console/console-panel/console-panel.component';
import {ConsoleInputComponent} from './console/console-input/console-input.component';
import {ConsoleLogComponent} from './console/console-log/console-log.component';
import {MessageChatComponent} from './console/messages/message-chat/message-chat.component';
import {MessageServerChatComponent} from './console/messages/message-server-chat/message-server-chat.component';

@NgModule({
  declarations: [
    AppComponent,
    ConsolePanelComponent,
    ConsoleInputComponent,
    ConsoleLogComponent,
    MessageChatComponent,
    MessageServerChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [
    StompRService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
