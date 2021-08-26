import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { PeriodicElement } from '../invoices/invoices.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailComponent } from './product-detail/product-detail.component';



const ELEMENT_DATA = [
  {name: 'MegaTech Service', header: 'Welcome to MegatechMail, this is a welcome email', message: 'MegaTech is an Africa based and is happy to have you join us on the evolution of email communication'},
  {name: 'MegaTech Customer', header: 'Welcome to MegatechMail, this is a welcome email', message: 'MegaTech is an Africa based and is happy to have you join us on the evolution of email communication'},
  {name: 'MegaTech Admin', header: 'Welcome to MegatechMail, this is a welcome email', message: 'MegaTech is an Africa based and is happy to have you join us on the evolution of email communication'},
  {name: 'MegaTech Support', header: 'Welcome to MegatechMail, this is a welcome email', message: 'MegaTech is an Africa based and is happy to have you join us on the evolution of email communication'},
  {name: 'MegaTech Accounts', header: 'Welcome to MegatechMail, this is a welcome email', message: 'MegaTech is an Africa based and is happy to have you join us on the evolution of email communication'},
  {name: 'MegaTech Admin', header: 'Welcome to MegatechMail, this is a welcome email', message: 'MegaTech is an Africa based and is happy to have you join us on the evolution of email communication'},
  {name: 'MegaTech Admin', header: 'Welcome to MegatechMail, this is a welcome email', message: 'MegaTech is an Africa based and is happy to have you join us on the evolution of email communication'},
  {name: 'MegaTech Service', header: 'Welcome to MegatechMail, this is a welcome email', message: 'MegaTech is an Africa based and is happy to have you join us on the evolution of email communication'},
  {name: 'MegaTech Accounts', header: 'Welcome to MegatechMail, this is a welcome email', message: 'MegaTech is an Africa based and is happy to have you join us on the evolution of email communication'},
];

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  
  displayedColumns: string[] = ['action', 'favorite', 'flag','name', 'header', 'time'];
  data = ELEMENT_DATA;
  dataSource!: MatTableDataSource<any>;
  /** Based on the screen size, switch from standard to one column per row */

   title = 'Products';
  ngOnInit(){
  
    console.log(this.data);
    this.dataSource = new MatTableDataSource(this.data);
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);
    console.log(this.dataSource);
  }
  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog) { }
  openModalDialog(){
    this.dialog.open(ProductDetailComponent, {
      width: '80%',
      data: null
    });
  }
}
