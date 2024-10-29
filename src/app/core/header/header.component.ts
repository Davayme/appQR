import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'qr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
 
  firebasesrv = inject(AuthService);
  router = inject(Router);

  logOut() {
    this.firebasesrv.logOut().then(() => {
      this.router.navigate(['/']); 
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
