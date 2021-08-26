import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
  providers: [AuthGuardService]
})
export class AuthenticationComponent implements OnInit {

  form:FormGroup;

    constructor(private fb:FormBuilder, private authGuardService: AuthGuardService, private router: Router) {
        this.form = this.fb.group({
            username: ['',Validators.required],
            password: ['',Validators.required]
        });
    }

    public login() {
        const val = this.form.value;

        if (val.username && val.password) {
          let response = this.authGuardService.login(val.username, val.password)
            if(response !== null){
              this.router.navigate(['/invoices']);
              
            }
        }
    }

  ngOnInit(): void {
  }

}
