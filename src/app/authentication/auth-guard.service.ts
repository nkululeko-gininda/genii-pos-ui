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
    let userProfile = 
    {
      "id": 0,
      "username": username,
      "password": password,
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "isActive": true,
      "roleId": 0,
      "createdDate": "2021-08-26T16:18:53.701Z"
    };
    let options = {headers:httpOptions.headers};
        
    this.http.post(environment.geniiposapi +'/users/authenticate', userProfile, options)
    .subscribe((authGuardResponse:any) => {
        if (authGuardResponse !=null) {
          this.setSession(authGuardResponse) //token here is stored in a local storage
        }
      },
      (err) => {
        console.log(err);
      }
    );  
    this.http.post(environment.geniiposapi +'/users/authuser', userProfile, options)
    .subscribe((authUser:any) => {
        if (authUser !=null) {
          this.setSessionUser(authUser) //token here is stored in a local storage
        }
      },
      (err) => {
        console.log(err);
      }
    );   
  }
  private setSession(authResult:any) {
    const expiresAt = moment().add(2,'days');
    sessionStorage.setItem('id_token', authResult);
    sessionStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    if(this.isLoggedIn()){
      this.router.navigate(['/invoices']);
      
    }
}  
private setSessionUser(authResult:any) {
  sessionStorage.setItem('user_id', authResult);
}         

logout() {
  sessionStorage.removeItem("id_token");
  sessionStorage.removeItem("expires_at");
}

public isLoggedIn():boolean {
  if(moment().valueOf() < this.getExpiration()){
    return true;
  }else{
    return false
  }
//    var expire = .isSameOrBefore(this.getExpiration());
  //  return expire;
}

isLoggedOut() {
    return !this.isLoggedIn();
}

getExpiration() {
    const expiration = sessionStorage.getItem("expires_at");
    const expiresAt = JSON.parse(JSON.stringify(expiration));
    return expiresAt;
}    
}
