import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'qr-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  title=""
  group!:FormGroup

  constructor(
    private reference:MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any){
      this.title = data ? "EDITAR" : "NUEVO"
  }

  ngOnInit(){
    this.loadForm()
  }

  save(){
    const record = this.group.value
    this.reference.close(record)
  }
  loadForm(){
    this.group = new FormGroup({
      id: new FormControl(this.data?.id),
      complaintId: new FormControl(this.data?.complaintId, Validators.required),
      status: new FormControl(this.data?.status, Validators.required),
      assignedTo: new FormControl(this.data?.assignedTo, Validators.required),
      createdDate: new FormControl(this.data?.createdDate, Validators.required),
      comments: new FormControl(this.data?.comments, Validators.required)
    })
  }

  
}
