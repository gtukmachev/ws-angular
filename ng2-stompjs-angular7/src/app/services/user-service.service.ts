import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  public userName: string;
  public userPass: string;

  constructor() { }
}
