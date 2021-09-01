import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { RolesComponent } from 'src/app/roles/roles.component';
import { environment, httpOptions } from 'src/environments/environment';
import { InvoiceItem } from '../invoice-detail/InvoiceItem.Model';
import { InvoiceItemService } from '../invoice-item.service';
import { Invoice } from '../Invoice.Model';

@Component({
  selector: 'app-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.css']
})
export class InvoiceItemComponent implements OnInit {
  dataSource: any;

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 }
      ];
    })
  );

  products: any;
  product:any;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild(RolesComponent)roleComponent!:RolesComponent ;
  formBuilder!: FormBuilder;
  invoiceFormGroup = new FormGroup({
    InvoiceItem: new FormControl(),
    Quantity: new FormControl(),
    Price: new FormControl(),
    Amount: new FormControl(),
    
  });
  productDetailsForm = new FormGroup({
    InvoiceItem: new FormControl(),
    Quantity: new FormControl(),
    Price: new FormControl(),
    Amount: new FormControl()
  });
  /** Based on the screen size, switch from standard to one column per row */
  /** Based on the screen size, switch from standard to one column per row */
  newInvoice: Invoice = new Invoice;
  newInvoiceItem: InvoiceItem = new InvoiceItem;
  productsList!: any[];
  invoiceItemsList: InvoiceItem[]=[];
  
  constructor(private breakpointObserver: BreakpointObserver, private snackBar: MatSnackBar,
  private http: HttpClient,private dialogRef: MatDialogRef<InvoiceItemComponent>, 
  public invoiceItemService: InvoiceItemService) { }
close(){
  this.dialogRef.close({ data: this.invoiceItemsList })
}
  ngOnInit(): void {
    this.onloadProducts();
  }
  onloadProducts(){
    let options = {headers:httpOptions.headers};
    this.http.get(environment.geniiposapi +'/products', options).subscribe((products: any)=>{
      this.productsList = products; 
      this.products = new MatTableDataSource(products);
      setTimeout(() => this.products.paginator = this.paginator);
      setTimeout(() => this.products.sort = this.sort);
      this.products = products;
    });
  }
  loadItemData(){
    var index:any;
    var element=this.productDetailsForm.get("InvoiceItem")?.value;
    console.log("RUN PROCESS::: LOAD PRODUCT DATA");
    console.log("===========================");
    
    let quantity = this.productDetailsForm.get("Quantity")?.value;
    let itemTotal = quantity* element.price;
    this.productDetailsForm.get('Price')?.setValue(element.price);
    this.productDetailsForm.get('Amount')?.setValue(itemTotal); 
    element.amount = itemTotal;
    let invoiceItemData = {
      Invoice: this.newInvoice,
      Product: element,
      Quantity:quantity,
      Amount:itemTotal 
    }
  }
  calculateItemAmount(){
    var index:any;
    var element=this.productDetailsForm.get("InvoiceItem")?.value;
    let quantity = this.productDetailsForm.get("Quantity")?.value;
    let itemTotal = quantity* element.price;
    this.productDetailsForm.get('Amount')?.setValue(itemTotal); 
    element.amount = itemTotal;
    let invoiceItemData = {
      Invoice: this.newInvoice,
      Product: element,
      Quantity:quantity,
      Price: element.price,
      Amount:itemTotal 
    }
  }
  saveProduct(){
    var element=this.productDetailsForm.get("InvoiceItem")?.value;
    
    let quantity = this.productDetailsForm.get("Quantity")?.value;
    let itemTotal = quantity* element.price;
    this.productDetailsForm.get('Amount')?.setValue(itemTotal); 
    element.amount = itemTotal;
    let invoiceItemData = {
      Invoice: this.newInvoice,
      Product: element,
      Quantity:quantity,
      Price: element.price,
      Amount:itemTotal 
    }
      this.invoiceItemService.setInvoiceItem(invoiceItemData);
    console.log("RUN PROCESS::: ADD ITEM");
    console.log("===========================");
    this.dialogRef.close();
    
  }
  onCancel(){
    this.dialogRef.close();
  }

}
