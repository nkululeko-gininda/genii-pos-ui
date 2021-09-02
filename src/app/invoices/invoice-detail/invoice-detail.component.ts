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
  options = {headers:httpOptions.headers};
  displayedColumns: string[] = ['Item Name', 'Quantity', 'Price', 'Amount', 'Action'];
  invoiceTotalColumns: string[] = ['SubTotal', 'VAT', 'Total'];
  dataSource = new MatTableDataSource<InvoiceItem>();
  invoiceTotalDS = new MatTableDataSource<any>();
  invoiceTotal: any;
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
  //nkg INvoice Status Variables
  invoiceStatusFormGroup = new FormGroup({
    InvoiceStatus: new FormControl()
  });
  invoiceStatusList!: any[];
  
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
  this.loadStatusData();
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
    this.openModalDialog();
  }

  onloadProducts(){
    this.http.get(environment.geniiposapi +'/products', this.options).subscribe((products: any)=>{
      this.productsList = products; 
      this.products = new MatTableDataSource(products);
      setTimeout(() => this.products.paginator = this.paginator);
      setTimeout(() => this.products.sort = this.sort);
      this.products = products;
    });
  }
  loadStatusData(){
    this.http.get(environment.geniiposapi +'/invoiceStatus', this.options).subscribe((status: any)=>{
      this.invoiceStatusList= status; 
     });
  }
  
  createDraftInvoice(){
    let snackbar = this.snackBar.open('Creating invoice', 'Done');
  
  }
  editItem(element: any, index:any){
  }
  loadItemData(element: any, index:any){
    element.price = element.product.price;
    let quantity = element.quantity;
    let itemTotal = quantity* element.product.price;
    element.amount = itemTotal;
    let invoiceItemData = {
      Invoice: this.newInvoice,
      Product: element.product,
      Quantity:quantity,
      Amount:itemTotal 
    }
    if(this.invoiceItemsList.find((item: any) => item.Product === element.product) !==null){
        this.invoiceItemsList[index] = invoiceItemData
     }
  }
  calculateItemAmount(){
    if(this.invoiceItemsList.length > 0){
    const subtotal = this.invoiceItemsList.reduce((sum, current) => sum + current.Amount, 0);
    var vat = subtotal * 0.15;
    var total = subtotal + vat;
    this.invoiceTotal={
      subtotal: subtotal,
      vat: vat,
      total: total
    };
    this.invoiceTotalDS.data =[this.invoiceTotal];
      setTimeout(() => this.invoiceTotalDS.paginator = this.paginator);
      setTimeout(() => this.invoiceTotalDS.sort = this.sort);
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
  async createFullInvoice(){
    let userProfile:any;
    let userId: any;
    let invoiceStatus:any;
    let statusId: any;
    let invoiceData:any;
 let invoice = {
      UserId: sessionStorage.getItem("user_id"),
      StatusId: this.invoiceStatusFormGroup.get("InvoiceStatus")?.value,
      Total: this.invoiceTotal.total,
      CreatedDate: new Date()
    }
    await this.http.post(environment.geniiposapi +'/invoices', JSON.stringify(invoice), this.options)
    .subscribe((response:any) => {
        invoiceData = response;
        this.invoiceItemsList.forEach((item:any)=>{
          let invoiceItem = {
            InvoiceId: invoiceData.id,
            ProductId: item.Product.id,
            Quantity: item.Quantity,
            CreatedDate: new Date()
          }
         this.registerInvoiceItem(invoiceItem);
        });
      },
      (err) => {
        console.log(err);
      }
    );
   let snackbar = this.snackBar.open('Invoice created successfully', 'Done');
  
    
  }
  async registerInvoiceItem(invoiceItem: any){
    let invoiceItemData:any;
      
    await this.http.post(environment.geniiposapi +'/invoiceitems', JSON.stringify(invoiceItem), this.options)
    .subscribe((response:any) => {
        console.log(response);
        invoiceItemData = response;
      },
      (err) => {
        console.log(err);
      }
    );
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
