import { inject, Injectable } from '@angular/core';
import { UserCredential, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { User} from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  constructor() { }

  async login(email:string, password:string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.saveDataInLocalStorage(userCredential.user);
    return userCredential;
  }

  saveDataInLocalStorage(user:User){
    const userData = {
      uid: user.uid,
      email: user.email,

    }

    localStorage.setItem('user', JSON.stringify(userData));
  }

  logOut(){
    localStorage.removeItem('user');
    return signOut(this.auth);
    
  }
}
