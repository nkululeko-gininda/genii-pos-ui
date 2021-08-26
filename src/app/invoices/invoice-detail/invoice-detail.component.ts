import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../Invoice.Model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/users/User.Model';
import { RolesComponent } from 'src/app/roles/roles.component';
import { Product } from 'src/app/products/Product.Model';
import { InvoiceItem } from './InvoiceItem.Model';


@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent {
  displayedColumns: string[] = ['Item Name', 'Quantity', 'Price', 'Amount', 'Action'];
  dataSource: any;
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
  constructor(private breakpointObserver: BreakpointObserver, private snackBar: MatSnackBar, private http: HttpClient) {
  this.onloadInvoices();
  this.onloadProducts();
  }
  onloadInvoices(){
    this.invoiceItemsList.push(this.newInvoiceItem);
      this.dataSource = new MatTableDataSource(this.invoiceItemsList);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
  }
  getInvoiceItemFormItem(){
    return this.formBuilder.group({
      InvoiceItem: [''],
      Quantity: [''],
      Price: [''],
      Amount: [''],
    });
  }
  addNewItem(){ 
    // this.dataSource = new MatTableDataSource(this.invoiceItemsList);
    //   setTimeout(() => this.dataSource.paginator = this.paginator);
    //   setTimeout(() => this.dataSource.sort = this.sort);
    this.invoiceItemsList.push(this.newInvoiceItem);
    this.dataSource = new MatTableDataSource(this.invoiceItemsList);
  }
  onloadProducts(){
    this.http.get(environment.geniiposapi + "/products").subscribe((products: any)=>{
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
  calculateItemAmount(element:any, index:any){
    console.log(this.invoiceItemsList);
    console.log("RUN PROCESS::: CALCULATE PRODUCT AMOUNT");
    console.log("===========================");
  
    let quantity = element.quantity;
    let itemTotal = quantity* element.product.price;
    //this.invoiceFormGroup.get('Amount')?.setValue(itemTotal);
    element.amount = itemTotal;
    let invoiceItemData = {
      Invoice: this.newInvoice,
      Product: element.product,
      Quantity:quantity,
      Price: element.product.price,
      Amount:itemTotal 
    }
    if(this.invoiceItemsList.find((item: any) => item.Product === this.product) !==null){
      console.log("RUN PROCESS::: ADD ITEM");
      console.log("===========================");
      this.invoiceItemsList[index] = invoiceItemData
   }
  }
  onSelectedRow(row:any){
    console.log("RUN PROCESS::: DATA SOURCE");
    console.log("===========================");
    console.log(this.invoiceItemsList);
    console.log("===========================");
  }
  createFullInvoice = async () => {
    
    const response =  await fetch(environment.geniiposapi + "/users");
    let userProfile = await response.json();
    let userId: any;
    
      userProfile.forEach((profile:any) =>{
        if(profile.id===1){
          
          userId = profile.id;
          userProfile = profile;
          if(userProfile.role===null){
            this.http.get(environment.geniiposapi + "/roles/" + userProfile.roleId).subscribe((role: any)=>{
              userProfile.role = role;
            });
          }
        }
      });

    const responseInvoiceStatus =  await fetch(environment.geniiposapi + "/invoiceStatus");
    let invoiceStatus = await responseInvoiceStatus.json();
    let statusId: any;
       
        invoiceStatus.forEach((profile:any) =>{
          if(profile.id===1){
            
            statusId=profile.id;
            invoiceStatus = profile;
          }});
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
    let persistanceUnit =await fetch(environment.geniiposapi + "/invoices", {
      method: 'POST',
      body: JSON.stringify(invoice),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    });
    invoiceData = await persistanceUnit.json();
    console.log("Invoice Data: " + invoiceData);
    let invoiceItem = {
      InvoiceId: invoiceData.id,
      ProductId: 1,
      Quantity: this.invoiceItemsList[0].Quantity,
      CreatedDate: new Date()
    }
    let invoiceItemData:any;
    
    persistanceUnit = await fetch(environment.geniiposapi + "/invoiceitems", {
      method: 'POST',
      body: JSON.stringify(invoiceItem),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    });
    invoiceItemData = await persistanceUnit.json();
    
    console.log("Invoice Item Data: " + invoiceItemData);
    
  }
  deleteItem(item:any){
    console.log("RUN PROCESS::: DELETE ITEM");
    console.log("===========================");
    console.log(item);
    console.log("===========================");
    this.invoiceItemsList = this.invoiceItemsList.filter(element => element != item);
  }

  }
