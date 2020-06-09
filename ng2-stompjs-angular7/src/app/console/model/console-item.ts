export class ConsoleItem {

  public dt: Date = new Date();
  public type: string = "ConsoleItem";

  constructor() {
  }

}

export class TextConsoleItem extends ConsoleItem {

  constructor(public txt: string) {
    super();
    this.type = "TextConsoleItem";
  }

}

export class UnknownCommandConsoleItem extends ConsoleItem {
  constructor(public command: string) {
    super();
    this.type = "UnknownCommandConsoleItem";
  }
}
