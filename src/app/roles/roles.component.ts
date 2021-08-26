import { Component, ViewChild } from '@angular/core';

import { FormArray, FormGroup, FormControl } from '@angular/forms'

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  name = 'Angular';
  public myForm!: FormGroup;

  ngOnInit() {
    this.myForm = new FormGroup({});
    for(let item of ['item1']) {
      this.myForm.addControl(item,
        new FormGroup({
          name: new FormControl(),
          medicineList: new FormArray([])
        })
      )
    } 
  } 

  onAddMedicine(group:any) {
    (group.get('medicineList') as FormArray).push(new FormControl())
  }

  medicineArray(group:any):FormArray
  {
    return group.get('medicineList') as FormArray
  }
  removeMedicine(group:any,index:number)
  {
    (group.get('medicineList') as FormArray).removeAt(index)
  }

}
