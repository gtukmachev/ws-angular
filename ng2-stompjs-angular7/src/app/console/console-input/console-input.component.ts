import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-console-input',
  templateUrl: './console-input.component.html',
  styleUrls: ['./console-input.component.css']
})
export class ConsoleInputComponent implements OnInit {
  commandInputText: string = "";

  @Output() onSubmit = new EventEmitter<string>();
  @Input() mode: string;

  @ViewChild("pwdField") pwdField: ElementRef;
  @ViewChild("inputField") inputField: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  submitCommand() {
    this.onSubmit.emit(this.commandInputText);
    this.commandInputText = ""
  }

  public focusPwd() {
    this.pwdField.nativeElement.focus()
    this.pwdField.nativeElement.select()
  }

  public focusInput() {
    this.inputField.nativeElement.focus()
    this.inputField.nativeElement.select()
  }

}
