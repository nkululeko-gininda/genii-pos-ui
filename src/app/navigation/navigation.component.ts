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

  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog, private snackBar: MatSnackBar, private route: Router, public authGuard: AuthGuardService) {
    
  }
  ngOnInit(){
    this.isAuthenticated = this.authGuard.isLoggedIn();
  }
  compose(){
    this.dialog.open(InvoiceDetailComponent, {
      width: '80%',
      data: null
    }).afterClosed().subscribe(result => {
      this.route.navigate(['/invoices']);
      window.location.reload();
    });
  }
  signOut(){
    this.authGuard.logout();
  }
}
