import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { StateService } from './core/services/state.service';

@Component({
  selector: 'qr-root',
  templateUrl: './app.component.html',
  //template:'<p>Hola</p>',
  styleUrls: ['./app.component.css']
  //styles:['p {color: red;}']
})
export class AppComponent implements OnInit {
  title = 'appGQR';
  expanded=true
  authSrv = inject(AuthService);
  isLogged:boolean = false;
  stateSrv = inject(StateService);
  toggleExpanded(expanded:boolean)
  {
    this.expanded = expanded
  }

  ngOnInit() {
    this.stateSrv.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLogged = isLoggedIn;
    });
  }
  
}
