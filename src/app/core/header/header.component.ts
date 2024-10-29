import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'qr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 
  firebasesrv = inject(AuthService);
  router = inject(Router);
  email:string = '';
  logOut() {
    this.firebasesrv.logOut().then(() => {
      this.router.navigate(['/']); 
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  getUserData(){
    const userData = this.firebasesrv.getUserData();
    this.email = userData.email;
  }

  ngOnInit(): void {
    this.getUserData();
  }
}
