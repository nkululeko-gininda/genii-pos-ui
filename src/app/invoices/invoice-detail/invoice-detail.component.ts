import { AfterViewInit, Component, Inject, Input, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../Invoice.Model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { environment, httpOptions } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/users/User.Model';
import { RolesComponent } from 'src/app/roles/roles.component';
import { Product } from 'src/app/products/Product.Model';
import { InvoiceItem } from './InvoiceItem.Model';
import { InvoiceItemComponent } from '../invoice-item/invoice-item.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceItemService } from '../invoice-item.service';


@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent{
  displayedColumns: string[] = ['Item Name', 'Quantity', 'Price', 'Amount', 'Action'];
  invoiceTotalColumns: string[] = ['SubTotal', 'VAT', 'Total'];
  dataSource = new MatTableDataSource<InvoiceItem>();
  invoiceTotal!: any[];
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
  /** Based on the screen size, switch from standard to one column per row */
  /** Based on the screen size, switch from standard to one column per row */
  newInvoice: Invoice = new Invoice;
  newInvoiceItem: InvoiceItem = new InvoiceItem;
  productsList!: any[];
  invoiceItemsList: InvoiceItem[]=[];
  @ViewChild(InvoiceItemComponent) invoiceItemComponent!:InvoiceItemComponent;
  constructor(private breakpointObserver: BreakpointObserver, 
    private snackBar: MatSnackBar, 
    private http: HttpClient, 
    public dialog: MatDialog,
    public invoiceItemService: InvoiceItemService) {
  this.onloadInvoices();
  this.onloadProducts();
  }
  onloadInvoices(){
    // this.invoiceItemsList.push(this.newInvoiceItem);
    this.invoiceItemsList = this.invoiceItemService.getInvoiceItem();
      this.dataSource.data =this.invoiceItemsList;
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.calculateItemAmount();
  }
  addNewItem(){ 
    // this.dataSource = new MatTableDataSource(this.invoiceItemsList);
    //   setTimeout(() => this.dataSource.paginator = this.paginator);
    //   setTimeout(() => this.dataSource.sort = this.sort);
    //this.onloadInvoices();
    this.openModalDialog();
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
  
  createDraftInvoice(){
    let snackbar = this.snackBar.open('Creating invoice', 'Done');
  
  }
  editItem(element: any, index:any){
  }
  loadItemData(element: any, index:any){
    console.log("RUN PROCESS::: LOAD PRODUCT DATA");
    console.log("===========================");
    element.price = element.product.price;
    let quantity = element.quantity;
    let itemTotal = quantity* element.product.price;
    //this.invoiceFormGroup.get('Price')?.setValue(element.price);
    //this.invoiceFormGroup.get('Amount')?.setValue(itemTotal); 
    element.amount = itemTotal;
    let invoiceItemData = {
      Invoice: this.newInvoice,
      Product: element.product,
      Quantity:quantity,
      Amount:itemTotal 
    }
    if(this.invoiceItemsList.find((item: any) => item.Product === element.product) !==null){
        console.log("RUN PROCESS::: ADD ITEM");
        console.log("===========================");
        this.invoiceItemsList[index] = invoiceItemData
     }
  }
  calculateItemAmount(){
    console.log(this.invoiceItemsList);
    console.log("RUN PROCESS::: CALCULATE PRODUCT AMOUNT");
    console.log("===========================");
    
  if(this.invoiceItemsList.length > 0){
    const subtotal = this.invoiceItemsList.reduce((sum, current) => sum + current.Amount, 0);
    var vat = subtotal * 0.15;
    var total = subtotal + vat;
    this.invoiceTotal.push({
      subtotal: subtotal,
      vat: vat,
      total: total
    });
  }
  }
  openModalDialog(){
    this.dialog.open(InvoiceItemComponent, {
      width: '80%',
      data: null
    }).afterClosed().subscribe(result=>{
      this.onloadInvoices();
    });
  }
  onSelectedRow(row:any){
    console.log("RUN PROCESS::: DATA SOURCE");
    console.log("===========================");
    console.log(this.invoiceItemsList);
    console.log("===========================");
  }
  createFullInvoice(){
    let userProfile:any;
    let userId: any;

    let options = {headers:httpOptions.headers};
    
    this.http.get(environment.geniiposapi +'/users', options)
    .subscribe((response:any) => {
        console.log(response);
        userProfile = response;
        userProfile.forEach((profile:any) =>{
          if(profile.id===1){
            
            userId = profile.id;
            userProfile = profile;
            if(userProfile.role===null){
              this.http.get(environment.geniiposapi + "/roles/" + userProfile.roleId, options).subscribe((role: any)=>{
                userProfile.role = role;
              });
            }
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
    
     

    let invoiceStatus:any;
    let statusId: any;

    this.http.get(environment.geniiposapi +'/invoiceStatus', options)
    .subscribe((response:any) => {
        console.log(response);
        invoiceStatus = response;
        invoiceStatus.forEach((profile:any) =>{
          if(profile.id===1){
            statusId=profile.id;
            invoiceStatus = profile;
          }});
      },
      (err) => {
        console.log(err);
      }
    );
       
     console.log("User Profile: " + userProfile.role);
     console.log("Invoice Status: " + invoiceStatus);
     
    let invoice = {
      UserId: userId,
      StatusId: statusId,
      Total: this.invoiceItemsList[0].Amount,
      CreatedDate: new Date()
    }
    console.log(JSON.stringify(invoice));
    
    let invoiceData:any;
    //this.http.post(environment.geniiposapi + "/invoices", {invoice});
   
    this.http.post(environment.geniiposapi +'/invoices', JSON.stringify(invoice), options)
    .subscribe((response:any) => {
        console.log(response);
        invoiceData = response;
      },
      (err) => {
        console.log(err);
      }
    );
 console.log("Invoice Data: " + invoiceData);
    let invoiceItem = {
      InvoiceId: invoiceData.id,
      ProductId: 1,
      Quantity: this.invoiceItemsList[0].Quantity,
      CreatedDate: new Date()
    }
    let invoiceItemData:any;
    
    
    this.http.post(environment.geniiposapi +'/invoiceitems', JSON.stringify(invoiceItem), options)
    .subscribe((response:any) => {
        console.log(response);
        invoiceItemData = response;
      },
      (err) => {
        console.log(err);
      }
    );
    console.log("Invoice Item Data: " + invoiceItemData);
    let snackbar = this.snackBar.open('Invoice created successfully', 'Done');
  
    
  }
  deleteItem(item:any){
    console.log("RUN PROCESS::: DELETE ITEM");
    console.log("===========================");
    console.log(item);
    console.log("===========================");
    this.invoiceItemsList = this.invoiceItemsList.filter(element => element != item);
  }

  }
