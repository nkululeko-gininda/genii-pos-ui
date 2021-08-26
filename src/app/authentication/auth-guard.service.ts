import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment, httpOptions } from 'src/environments/environment';
import { User } from '../users/User.Model';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  constructor(private http: HttpClient, private router: Router) {
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  login(username:string, password:string ) {
    let userProfile = {
      "id": 0,
  "username": username,
  "password": password,
  "firstName": "",
  "lastName": "",
  "email": "",
  "isActive": true,
  "roleId": 0,
  "createdDate": new Date().toDateString
    }
    let options = {headers:httpOptions.headers};
        
    return this.http.post(environment.geniiposapi +'/Users/authenticate', JSON.stringify(userProfile), options)
    .subscribe((authGuardResponse:any) => {
        console.log(authGuardResponse);
        if (authGuardResponse !=null) {
          this.setSession(authGuardResponse) //token here is stored in a local storage
        }
      },
      (err) => {
        console.log(err);
      }
    );   
  }
  private setSession(authResult:any) {
    const expiresAt = moment().add(12,'hour');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
}          

logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
}

public isLoggedIn():boolean {
    return moment().isBefore(this.getExpiration());
}

isLoggedOut() {
    return !this.isLoggedIn();
}

getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(JSON.stringify(expiration));
    return moment(expiresAt);
}    
}
