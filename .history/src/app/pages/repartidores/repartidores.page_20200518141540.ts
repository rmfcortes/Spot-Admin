import { Component, OnInit } from '@angular/core';

import { MenuController, ModalController } from '@ionic/angular';

import { FileViewerPage } from 'src/app/modals/file-viewer/file-viewer.page';

import { RepartidoresService } from 'src/app/services/repartidores.service';

import { RepartidorPreview, RepartidorInfo } from 'src/app/interface/repartidor.interface';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/region.service';

@Component({
  selector: 'app-repartidores',
  templateUrl: './repartidores.page.html',
  styleUrls: ['./repartidores.page.scss'],
})
export class RepartidoresPage implements OnInit {

  regiones: string[] = []
  region = ''
  verRegiones = false

  repartidores: RepartidorPreview[] = []
  suspendidos: RepartidorPreview[] = []
  repartidor: RepartidorInfo
  loadingRepartidores = false
  loadingSuspendidos = false

  enable_toogle = false

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
        console.log(regiones)
        for (const region of regiones) {
          this.regiones.push(region.referencia)
        }
      })
    }
  }

  // Acciones

  setRegion(region: string) {
    if (region === this.region) return
    this.region = region
    this.loadingRepartidores = true
    this.loadingSuspendidos = true
    this.getRepartidores()
    this.getSuspendidos()
    this.verRegiones = false
  }

  getRepartidores() {
    this.repartidoresService.getRepartidoresPreview(this.region, this.batch + 1, this.lastKey)
    .then(repartidores => {
      console.log(repartidores)
      this.loadingRepartidores = false
      if (repartidores.length === this.batch + 1) {
        this.lastKey = repartidores[repartidores.length - 1].id
        repartidores.pop()
      } else {
        this.noMore = true
      }
      this.repartidores = this.repartidores.concat(repartidores)
    })
  }

  getSuspendidos() {
    this.repartidoresService.getSuspendidos(this.region)
    .then(repartidores => {
      console.log(repartidores)
      this.loadingSuspendidos = false
      this.suspendidos = repartidores
    })
  }

  verRepartidor(preview: RepartidorPreview) {
    this.repartidoresService.getRepartidorDetalles(preview.id, this.region)
    .then(detalles => {
      this.repartidor = {
        preview,
        detalles
      }
      setTimeout(() => {
        this.enable_toogle = true
      }, 500);
    })
  }

  async setHabilitado(value: boolean) {
    if (!this.enable_toogle) return
    if (value) {
      this.repartidoresService.reActiva(this.repartidor, this.region)
      this.suspendidos = this.suspendidos.filter(d => d.id !== this.repartidor.preview.id)
      this.repartidores.push(this.repartidor.preview)
    } else {
      this.repartidoresService.suspende(this.repartidor, this.region)
      this.repartidores = this.repartidores.filter(d => d.id !== this.repartidor.preview.id)
      this.suspendidos.push(this.repartidor.preview)
    }
    this.repartidor = null
    this.enable_toogle = false
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
    this.loadingRepartidores = true
    this.getRepartidores()
  }

}
