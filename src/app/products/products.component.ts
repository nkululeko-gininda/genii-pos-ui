import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { PeriodicElement } from '../invoices/invoices.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HttpClient } from '@angular/common/http';
import { environment, httpOptions } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  
  displayedColumns: string[] = ['Name', 'Inventory', 'Price','Active', 'Action'];
  data:any;
  dataSource!: MatTableDataSource<any>;
  /** Based on the screen size, switch from standard to one column per row */

   title = 'Products';
  ngOnInit(){
  
   this.getAllProducts();
  }
  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog, private http: HttpClient, private snackBar:MatSnackBar) { }
  openModalDialog(){
    this.dialog.open(ProductDetailComponent, {
      width: '80%',
      data: null
    });
    this.getAllProducts();
  }
  getAllProducts(){
 let options = {headers:httpOptions.headers};
    this.http.get(environment.geniiposapi +'/products', options)
    .subscribe((response:any) => {
        this.data  = response;
        this.dataSource = new MatTableDataSource(this.data);
        setTimeout(() => this.dataSource.paginator = this.paginator);
        setTimeout(() => this.dataSource.sort = this.sort);
        },
      (err) => {
        console.log(err);
      }
    ); 
  }
}
