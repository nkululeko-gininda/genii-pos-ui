import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment, httpOptions } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  /** Based on the screen size, switch from standard to one column per row */
  productDetailsForm = new FormGroup({
    productName: new FormControl(),
    stock: new FormControl(),
    price: new FormControl()
  });
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 6, rows: 1 }
      ];
    })
  );
product:any;
isEdit:boolean=false;
  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient, private snackBar:MatSnackBar, @Inject(MAT_DIALOG_DATA) public data:any) {
    if(data !=null){
      this.isEdit=true
      this.setProductValues();
    }
  }
  setProductValues(){
    let element = this.data;
    this.productDetailsForm.controls['productName'].setValue(element.name);
    this.productDetailsForm.controls['stock'].setValue(element.stock);
    this.productDetailsForm.controls['price'].setValue(element.price);
  }
  newProduct(){
    this.product = {
            "id": 0,
            "name": this.productDetailsForm.controls['productName'].value,
            "stock": this.productDetailsForm.controls['stock'].value,
            "price": this.productDetailsForm.controls['price'].value,
            "isActive": true,
            "createdDate": new Date()
        };
  }
  saveProduct(){
    if(this.isEdit){
      this.product = {
        "id": this.data.id,
        "name": this.productDetailsForm.controls['productName'].value,
        "stock": this.productDetailsForm.controls['stock'].value,
        "price": this.productDetailsForm.controls['price'].value,
        "isActive": true,
        "createdDate": this.data.createdDate
    };
      let options = {headers:httpOptions.headers};
      this.http.put(environment.geniiposapi +'/products/' + this.data.id, JSON.stringify(this.product), options)
      .subscribe((response:any) => {
          console.log(response);
          let alert = this.snackBar.open("Product updated successfully", "Done");
        },
        (err) => {
          console.log(err);
        }
      );
    }else{
      this.newProduct();
      let options = {headers:httpOptions.headers};
      this.http.post(environment.geniiposapi +'/products', this.product, options)
      .subscribe((response:any) => {
          console.log(response);
          let alert = this.snackBar.open("Product added successfully", "Done");
        },
        (err) => {
          console.log(err);
        }
      );
    }
     
  }
}
