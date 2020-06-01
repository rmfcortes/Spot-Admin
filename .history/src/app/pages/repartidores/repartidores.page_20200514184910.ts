import { Component, OnInit } from '@angular/core';

import { MenuController } from '@ionic/angular';

import { RepartidoresService } from 'src/app/services/repartidores.service';

import { RepartidorPreview } from 'src/app/interface/repartidor.interface';

@Component({
  selector: 'app-repartidores',
  templateUrl: './repartidores.page.html',
  styleUrls: ['./repartidores.page.scss'],
})
export class RepartidoresPage implements OnInit {

  repartidores: RepartidorPreview[]

  constructor(
    private menu: MenuController,
    private repartidoresService: RepartidoresService,
  ) { }

  ngOnInit() {
    this.getRegiones()
  }

  ionViewWillEnter() {
    this.menu.enable(true)
  }

  getRepartidores(region: string) {
    this.repartidoresService.getRepartidoresPreview()
  }

}
