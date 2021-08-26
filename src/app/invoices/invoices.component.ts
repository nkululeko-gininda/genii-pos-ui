import { Component, Inject, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { environment, httpOptions } from 'src/environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthGuardService } from '../authentication/auth-guard.service';

//nkg TEMP CODE TEST ONLY
export interface PeriodicElement {
  name: string;
  header: string;
  message: string;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {
  displayedColumns: string[] = ['action','creator', 'status', 'time', 'total'];
  dataSource: any;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  
    
  /** Based on the screen size, switch from standard to one column per row */

   title = 'Invoice';

  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient, @Inject('AuthGuardService') authGuard: AuthGuardService) {
    this.onloadInvoices();
  }
  ngOnInit(){
    
  }
  onloadInvoices(){
    this.http.get(environment.geniiposapi + "/invoices").subscribe((invoices: any)=>{
      this.dataSource = new MatTableDataSource(invoices);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      console.log(this.dataSource);
      this.dataSource = invoices;
    });
  }

}
