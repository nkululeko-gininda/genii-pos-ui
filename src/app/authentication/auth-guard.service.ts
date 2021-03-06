import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment, httpOptions } from 'src/environments/environment';
import { User } from '../users/User.Model';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  token:any;
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
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "isActive": true,
      "roleId": 0,
      "createdDate": "2021-09-04T13:56:54.167Z"
    };
    let options = {headers:httpOptions.headers};
     this.http.post(environment.geniiposapi +'/users/authenticate', userProfile, options)
    .subscribe((authGuardResponse:any) => {
        if (authGuardResponse !=null) {
          this.setSession(authGuardResponse, userProfile) //token here is stored in a local storage
          }
      },
      (err) => {
        console.log(err);
      }
    ); 
    console.log(this.token );
    let userhttpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*',
        'Accept':'application/json',
        'Authorization': "Bearer " + this.token 
      })
    };
   
    this.http.post(environment.geniiposapi +'/users/authuser', JSON.stringify(userProfile), userhttpOptions)
       .subscribe((data:any) => {
           if (data !=null) {
             this.setSessionUser(data) //token here is stored in a local storage
             if(this.isLoggedIn()){
              this.router.navigate(['/invoices']); 
              
            }
           }
         },
         (err) => {
           console.log(err);
         }
       );  
      
  }
  private setSession(authResult:any, userProfile:any) {
    const expiresAt = moment().add(2,'days');
    this.token = authResult;
    sessionStorage.setItem('id_token', authResult);
    sessionStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    
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
