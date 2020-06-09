import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private userName: string;
  private userPass: string;

  private topicSubscription: Subscription;

  public pass: Subject<string> = new BehaviorSubject<string>(null);

  constructor() { }

  public updateUser(userName: string, userPass: string) {
    this.userName = userName;
    this.userPass = userPass;
    this.pass.next(userPass);
  }

}
