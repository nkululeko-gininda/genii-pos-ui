import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthGuardService } from './authentication/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GeniiPosApp';
  isNotAuthenticated  = true;
  isAuthenticated  = false;
  constructor(private snackBar: MatSnackBar, private route: Router, public authGuard: AuthGuardService) {
    
  }
  ngOnInit(){
    if(this.authGuard.isLoggedIn()){
      this.isAuthenticated  = true;
      this.isNotAuthenticated = false;
    }
      
  }
}
