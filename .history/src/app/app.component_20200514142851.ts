import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {

  public appPages = [
    {
      title: 'Mapa',
      url: '/home',
      icon: 'location'
    },
    {
      title: 'Repartidores',
      url: '/repartidores',
      icon: 'car'
    },
    {
      title: 'Historial',
      url: '/historial',
      icon: 'book'
    },
  ]

  constructor(
    private router: Router,
    private platform: Platform,
    private authService: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', (event) => {
          event.preventDefault()
          event.stopPropagation()
        }, false);
      })
      // this.swService.checkUpdates()
    })
  }


  logOut() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }

}
