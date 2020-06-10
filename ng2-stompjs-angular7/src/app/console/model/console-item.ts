import {IChatMessage} from "./chat-message";

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

export class SimpleCommandConsoleItem extends ConsoleItem {
  constructor(public command: string, public args: string[]) {
    super();
    this.type = "SimpleCommandConsoleItem";
  }
}

export class ChatConsoleItem extends ConsoleItem {

  static userClassesCache: ClassesCache = {}
  static hashCode(s) {
    let h;
    for(let i = 0; i < s.length; i++)
      h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
  }

  public userClass: string = "0";

  constructor(public message: IChatMessage) {
    super();
    if (message.user == "server") {
      this.type = "ServerChatConsoleItem";
    } else {
      this.type = "ChatConsoleItem";
    }

    this.userClass = this.defineUserClass(message.user);
  }

  private defineUserClass(userName: string): string {
    let cls: string = ChatConsoleItem.userClassesCache[userName]
    if (cls == null) {
      let code = ChatConsoleItem.hashCode(this.message.user)
      cls = `user-${code % 10}`
      ChatConsoleItem.userClassesCache[userName] = cls
    }
    return cls
  }

}

interface ClassesCache {
  [key: string]: string;
}
