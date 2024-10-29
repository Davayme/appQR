import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    return this.checkLogin();
  }

  canLoad(): boolean {
    return this.checkLogin();
  }

  private checkLogin(): boolean {
    if (this.authService.isLogged()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
