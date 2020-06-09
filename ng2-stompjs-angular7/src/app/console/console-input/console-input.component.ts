import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-console-input',
  templateUrl: './console-input.component.html',
  styleUrls: ['./console-input.component.css']
})
export class ConsoleInputComponent implements OnInit {
  commandInputText: string = "";

  @Output() onSubmit = new EventEmitter<string>();
  @Input() mode: string;

  constructor() { }

  ngOnInit(): void {
  }

  submitCommand() {
    this.onSubmit.emit(this.commandInputText);
    this.commandInputText = ""
  }

}
