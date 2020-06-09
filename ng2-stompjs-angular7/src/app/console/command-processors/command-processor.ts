import {ConsoleItem} from "../model/console-item";

export abstract class CommandProcessor {

  abstract process(command: string): ConsoleItem;

}
