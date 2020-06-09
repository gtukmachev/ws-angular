import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StompRService} from '@stomp/ng2-stompjs';
import {FormsModule} from "@angular/forms";
import {ConsolePanelComponent} from './console/console-panel/console-panel.component';
import {ConsoleInputComponent} from './console/console-input/console-input.component';
import {ConsoleLogComponent} from './console/console-log/console-log.component';

@NgModule({
  declarations: [
    AppComponent,
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
  bootstrap: [AppComponent]
})
export class AppModule { }
