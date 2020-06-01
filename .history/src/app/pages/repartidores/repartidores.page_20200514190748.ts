import { Component, OnInit } from '@angular/core';

import { MenuController, ModalController } from '@ionic/angular';

import { FileViewerPage } from 'src/app/modals/file-viewer/file-viewer.page';

import { RepartidoresService } from 'src/app/services/repartidores.service';

import { RepartidorPreview } from 'src/app/interface/repartidor.interface';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/region.service';

@Component({
  selector: 'app-repartidores',
  templateUrl: './repartidores.page.html',
  styleUrls: ['./repartidores.page.scss'],
})
export class RepartidoresPage implements OnInit {

  regiones: string[]

  repartidores: RepartidorPreview[]
  repartidor: RepartidorPreview

  batch = 24
  lastKey = ''
  noMore = false

  constructor(
    private menu: MenuController,
    private modalCtrl: ModalController,
    private repartidoresService: RepartidoresService,
    private commonService: CommonService,
    private regionService: RegionService,
  ) { }

  // Info inicial
  ngOnInit() {
    this.getRegiones()
  }

  ionViewWillEnter() {
    this.menu.enable(true)
  }

  async getRegiones() {
    this.regiones = []
    const regiones = await this.commonService.getRegiones()
    if (regiones.length === 0) {
      this.regionService.getRegiones()
      .then(regiones => {
        this.commonService.setRegiones(regiones)
        for (const region of regiones) {
          this.regiones.push(region.referencia)
        }
      })
    }
  }

  // Acciones

  getRepartidores(region: string) {
    this.repartidoresService.getRepartidoresPreview(region, this.batch + 1, this.lastKey)
    .then(repartidores => {
      if (repartidores.length === this.batch + 1) {
        this.lastKey = repartidores[repartidores.length - 1].id
        repartidores.pop()
      } else {
        this.noMore = true
      }
      this.repartidores = this.repartidores.concat(repartidores)
    })
  }

  verRepartidor(repartidor: RepartidorPreview) {

  }

  async verArchivo(archivo:string) {
    const modal = await this.modalCtrl.create({
      component: FileViewerPage,
      cssClass: 'modal_file',
      componentProps: {archivo}
    })

    return await modal.present()
  }

  loadMoreRepartidores() {
    if (this.noMore) return
    this.getRepartidores()
  }

}
