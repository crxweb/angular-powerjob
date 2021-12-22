import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';

@Injectable()
export class SignupService {
  private url = "http://jsonplaceholder.typicode.com/users";

  constructor(private http: Http) {}

  checkEmailNotTaken(email: string) {
    return this.http
      //.get('assets/users.json')
      .get(this.url)
      .delay(1000)
      .map(res => res.json())
      .map(users => users.filter(user => user.email === email))
      .map(users => !users.length);
      
  }
}
