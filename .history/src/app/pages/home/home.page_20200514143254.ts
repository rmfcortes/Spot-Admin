import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MenuController } from '@ionic/angular';

import { RepartidoresService } from 'src/app/services/repartidores.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/region.service';

import { Pedido, Repartidor, PedidoPendiente } from 'src/app/interface/pedido.interface';
import { RepartidorAsociado } from 'src/app/interface/repartidor.interface';
import { Region, Ubicacion } from 'src/app/interface/region.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  icon_cliente = '../../../assets/img/pin.png'
  icon_repartidor = '../../../assets/img/repartidor.png'

  regiones: Region[] = []
  regionReady = false

  pedidos: PedidoPendiente[] = []
  pedido: Pedido
  
  repartidores: RepartidorAsociado[]
  repartidor: Repartidor
  repSub: Subscription

  map: any
  centro: Ubicacion = {
    lat: 0,
    lng: 0
  }
  openedPedidoWindow: number
  openedWindow: number

  constructor(
    private menu: MenuController,
    private repartidoresService: RepartidoresService,
    private pedidoService: PedidosService,
    private commonService: CommonService,
    private regionService: RegionService,
  ) {}

  // Info inicial
  ngOnInit() {
    this.getRegiones()
  }

  ionViewWillEnter() {
    this.menu.enable(true)
    this.commonService.setTitle('Spot admin')
  }

  getRegiones() {
    this.regionService.getRegiones()
    .then(regiones => {
      console.log(regiones)
      this.regiones = regiones
      this.regionReady = true
      if (this.regiones.length > 0) this.getPedidos()
    })
  }

  async getPedidos() {
    const fecha = await this.pedidoService.formatDate(new Date())
    this.pedidoService.listenPedidos(fecha).off('child_added')
    this.pedidoService.listenPedidos(fecha).on('child_added', snapshot => {
      const pedido: Pedido = snapshot.val()
      if (this.pedidos.length === 0) {
        this.pedidos = [{
          region: pedido.region,
          pedidos: [pedido]
        }]
      } else {
        const i = this.pedidos.findIndex(p => p.region === pedido.region)
        if (i >= 0) this.pedidos[i].pedidos.concat(pedido)
        else this.pedidos.push({region: pedido.region, pedidos: [pedido]})
      }
    })
  }

  // Acciones
  getRepartidores(region: string) {
    this.openedWindow = null
    if (this.repSub) this.repSub.unsubscribe()
    this.repSub = this.repartidoresService.getRepartidoresActivos(region)
    .subscribe((repartidores: RepartidorAsociado[]) => {
      this.repartidores = repartidores
    })
  }

  verInfoRepartidor(i: number, idRepartidor: string) {
    this.repartidoresService.getRepartidorInfo(idRepartidor)
    .then(repartidor => {
      this.openedWindow = i
      this.repartidor = repartidor
    })
  }

  asignarViaje() {

  }

  // Mapa

  onMapReady(map) {
    this.map = map
  }

  verInfoPedido(i, pedido: Pedido) {
    this.pedido = pedido
    this.openedPedidoWindow = i
  }

  isInfoWindowPedido(i) {
    if (this.openedPedidoWindow === i) {
      return true;
    } else {
      return false;
    }
  }

  isInfoWindowOpen(i) {
    if (this.openedWindow === i) {
      return true;
    } else {
      return false;
    }
  }

  // Tracks

  trackByRepartidor(index:number, el: RepartidorAsociado): string {
    return el.id
  }

  trackByPedido(index:number, el: Pedido): string {
    return el.id
  }

  trackByPendiente(index:number, el: PedidoPendiente): string {
    return el.region
  }

  trackByRegion(index:number, el: Region): string {
    return el.referencia
  }

}
