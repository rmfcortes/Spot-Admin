import { Component } from '@angular/core';

import { MenuController } from '@ionic/angular';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private menu: MenuController,
    private commonService: CommonService,
  ) {}

  ionViewWillEnter() {
    this.menu.enable(true)
    this.commonService.setTitle('Spot admin')
  }


  trackByRepartidor(index:number, el: DriverActivo): string {
    return el.id
  }


}
