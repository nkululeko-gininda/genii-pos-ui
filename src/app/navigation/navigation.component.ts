import { Component, Inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailComponent } from '../products/product-detail/product-detail.component';
import { Router } from '@angular/router';
import { InvoiceDetailComponent } from '../invoices/invoice-detail/invoice-detail.component';
import { AuthGuardService } from '../authentication/auth-guard.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  providers: [AuthGuardService]
})
export class NavigationComponent implements OnInit{
  isAuthenticated = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private snackBar: MatSnackBar, private route: Router, public authGuard: AuthGuardService) {
    
  }
  ngOnInit(){
    this.isAuthenticated = this.authGuard.isLoggedIn();
  }
  compose(){
    this.route.navigate(['/new-invoice']);
    //this.dialog.open(InvoiceDetailComponent);
    //let snackbar = this.snackBar.open('New Invoice', 'Done');
  }
}
