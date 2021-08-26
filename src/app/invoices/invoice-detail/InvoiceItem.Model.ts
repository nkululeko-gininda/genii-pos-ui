import { Product } from "src/app/products/Product.Model"
import { Invoice } from "../Invoice.Model"

export class InvoiceItem{
    Invoice!: Invoice;
    Product!: Product;
    Quantity:any;
    Amount:any   
}