import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private isVisibleComponent = new BehaviorSubject<boolean>(false);
  isVisible$ = this.isVisibleComponent.asObservable();

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor() { }

  // Alternar el estado de visibilidad
  toggleVisibility() {
    const currentValue = this.isVisibleComponent.value;
    this.isVisibleComponent.next(!currentValue);
  }

  // Actualizar el estado de autenticación
  setLoggedInState(isLoggedIn: boolean) {
    this.isLoggedIn.next(isLoggedIn);
  }
}