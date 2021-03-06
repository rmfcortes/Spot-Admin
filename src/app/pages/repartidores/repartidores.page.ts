import { MenuController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { HostListener } from "@angular/core";

import { FileViewerPage } from 'src/app/modals/file-viewer/file-viewer.page';
import { RepartidorPage } from 'src/app/modals/repartidor/repartidor.page';

import { RepartidoresService } from 'src/app/services/repartidores.service';

import { RepartidorPreview, RepartidorInfo } from 'src/app/interface/repartidor.interface';

@Component({
  selector: 'app-repartidores',
  templateUrl: './repartidores.page.html',
  styleUrls: ['./repartidores.page.scss'],
})
export class RepartidoresPage implements OnInit {

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.scrHeight = window.innerHeight
    this.scrWidth = window.innerWidth
  }
  scrHeight: number
  scrWidth: number
  hideMainCol = false

  regiones: string[] = []
  region = ''
  verRegiones = false

  repartidores: RepartidorPreview[] = []
  suspendidos: RepartidorPreview[] = []
  repartidor: RepartidorInfo
  loadingRepartidores = false
  loadingSuspendidos = false

  suspendidoSel = false

  enable_toogle = false

  batch = 24
  lastKey = ''
  noMore = false

  constructor(
    private menu: MenuController,
    private modalCtrl: ModalController,
    private repartidoresService: RepartidoresService,
  ) { this.getScreenSize() }

  // Info inicial
  ngOnInit() {
    this.menu.enable(true)
  }

  // Acciones

  async editRepartidor(repartidor: RepartidorInfo) {
    let nuevo
    if (repartidor) nuevo = false
    else {
      nuevo = true
      repartidor = {
        detalles: {
          habilitado: false,
          pass: '',
          user: '',
          vehiculo: '',
        },
        preview: {
          foto: '',
          id: '',
          nombre: '',
          telefono: '',
          activo: false,
          calificaciones: 1,
          distancia: 0,
          last_notification: 0,
          last_pedido: 0,
          lat: 0,
          lng: 0,
          maneja_efectivo: false,
          pedidos_activos: 0,
          promedio: 5,
        }
      }
    }
    const modal = await this.modalCtrl.create({
      component: RepartidorPage,
      componentProps: {region: this.region, repartidor}
    })

    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        if (resp.data === 'Eliminado') {
          this.repartidores = this.repartidores.filter(r => r.id !== repartidor.preview.id)
          this.repartidor = null
        } else {
          this.repartidores.push(resp.data.preview)
        }
      }
    })

    return await modal.present()
  }

  setRegion(region: string) {
    if (region === this.region) return
    this.region = region
    this.loadingRepartidores = true
    this.loadingSuspendidos = true
    this.suspendidos = []
    this.repartidores = []
    this.repartidor = null
    this.getRepartidores()
    this.getSuspendidos()
    this.verRegiones = false
  }

  getRepartidores() {
    this.repartidoresService.getRepartidoresPreview(this.region, this.batch + 1, this.lastKey)
    .then(repartidores => {
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
      this.loadingSuspendidos = false
      this.suspendidos = repartidores
    })
  }

  verRepartidor(preview: RepartidorPreview, suspendido: boolean) {
    this.enable_toogle = false
    this.repartidoresService.getRepartidorDetalles(preview.id, this.region, suspendido)
    .then(detalles => {
      this.repartidor = {
        preview,
        detalles
      }
      if (this.scrWidth < 992) this.hideMainCol = true
      if (suspendido) this.suspendidoSel = true
      else this.suspendidoSel = false
      setTimeout(() => {
        this.enable_toogle = true
      }, 500)
    })
  }

  regresa() {
    this.hideMainCol = false
    this.repartidor = null
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

  setEfectivo(value: boolean) {
    this.repartidoresService.setEfectivo(this.region, this.repartidor.preview.id, this.suspendidoSel, value)
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
