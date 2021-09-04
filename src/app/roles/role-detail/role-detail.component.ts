import { Component, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment, httpOptions } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.css']
})
export class RoleDetailComponent {
  /** Based on the screen size, switch from standard to one column per row */
  roleDetailsForm = new FormGroup({
    role: new FormControl(),
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
role:any;
isEdit:boolean=false;
  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient, private snackBar:MatSnackBar, @Inject(MAT_DIALOG_DATA) public data:any) {
    if(data !=null){
      this.isEdit=true
      this.setRoleValues();
    }
  }
  setRoleValues(){
    let element = this.data;
    this.roleDetailsForm.controls['role'].setValue(element.name);
   
  }
  newProduct(){
    this.role = {
            "id": 0,
            "name": this.roleDetailsForm.controls['role'].value
            
        };
  }
  saveProduct(){
    if(this.isEdit){
      this.role = {
        "id": this.data.id,
        "name": this.roleDetailsForm.controls['role'].value
        
    };
      let options = {headers:httpOptions.headers};
      this.http.put(environment.geniiposapi +'/roles/' + this.data.id, JSON.stringify(this.role), options)
      .subscribe((response:any) => {
          console.log(response);
          let alert = this.snackBar.open("Role updated successfully", "Done");
        },
        (err) => {
          console.log(err);
        }
      );
    }else{
      this.newProduct();
      let options = {headers:httpOptions.headers};
      this.http.post(environment.geniiposapi +'/roles', this.role, options)
      .subscribe((response:any) => {
          console.log(response);
          let alert = this.snackBar.open("Role added successfully", "Done");
        },
        (err) => {
          console.log(err);
        }
      );
    }
     
  }
}
