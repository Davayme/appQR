import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'qr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  group: FormGroup
  router = inject(Router);
  authsrv = inject(AuthService);

  constructor() {
    this.group = new FormGroup({
      email: new FormControl(null, Validators.email),
      password: new FormControl(null, Validators.required)
    })
  }

  login(){
    const record = this.group.value;
    if(record.email && record.password){
      this.authsrv.login(record.email, record.password)
      .then(() => {
        this.router.navigate(['/agencies']);
      })
    } else {
      alert('Llene los campos');
    }
  }

}
