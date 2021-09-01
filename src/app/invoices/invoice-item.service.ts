import { Injectable } from '@angular/core';
import { InvoiceItem } from './invoice-detail/InvoiceItem.Model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceItemService {
  invoiceItemsList: InvoiceItem[]=[];
  
  constructor() { }
  setInvoiceItem(invoiceItem: any){
    var index = this.invoiceItemsList.findIndex((item: any) => item.Product===invoiceItem.Product);
    if(index > -1){
      this.invoiceItemsList[index] = invoiceItem;
    }else{
      this.invoiceItemsList.push(invoiceItem);
    }
    
  }
  getInvoiceItem(){
    return this.invoiceItemsList;
  }
}
