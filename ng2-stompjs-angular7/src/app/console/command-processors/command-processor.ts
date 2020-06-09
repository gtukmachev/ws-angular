import {ConsoleItem, SimpleCommandConsoleItem} from "../model/console-item";

export abstract class CommandProcessor {

  abstract process(command: string): ConsoleItem[];

}

export class SimpleCommandsProcessor implements CommandProcessor{

  private availableCommands: string[] = ["login", "join", "connect", "logout", "exit", "x"]

  constructor() {
  }

  process(command: string): ConsoleItem[] {
    if (command == null) return null;
    let lc = command.trim().toLocaleLowerCase()

    let tokens: string[] = command
      .trim()
      .split(" ")
        .map(el => el.trim())
        .filter(el => el.length > 0)

    if (tokens.length == 0) return null;

    let commandToken: string = tokens[0];
    tokens.shift();

    if (this.availableCommands.find(el => el == commandToken)) {
      return [new SimpleCommandConsoleItem(commandToken, tokens)];
    }

    return null;
  }

}
