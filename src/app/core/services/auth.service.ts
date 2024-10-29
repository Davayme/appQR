import { inject, Injectable } from '@angular/core';
import { UserCredential, Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  stateService = inject(StateService);

  constructor() { }

  async login(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.saveDataInLocalStorage(userCredential.user);
    this.stateService.setLoggedInState(true); // Actualiza el estado de autenticación
    return userCredential;
  }

  saveDataInLocalStorage(user: User) {
    const userData = {
      uid: user.uid,
      email: user.email,
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }

  logOut() {
    localStorage.removeItem('user');
    this.stateService.setLoggedInState(false); // Actualiza el estado de autenticación
    return signOut(this.auth);
  }

  getUserData(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  isLogged(): boolean {
    return !!localStorage.getItem('user');
  }
}