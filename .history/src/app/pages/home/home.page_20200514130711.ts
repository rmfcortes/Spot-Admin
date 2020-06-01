import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MenuController } from '@ionic/angular';

import { PedidosService } from 'src/app/services/pedidos.service';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/region.service';

import { RepartidorAsociado } from 'src/app/interface/repartidor.interface';
import { Region } from 'src/app/interface/region.interface';
import { Pedido } from 'src/app/interface/pedido.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  icon_cliente = '../../../assets/img/cliente.png'

  regiones: Region[] = []
  regionReady = false

  pedidos: Pedido[] = []
  pedido: Pedido

  pedidoSub: Subscription

  openedPedidoWindow: number

  constructor(
    private menu: MenuController,
    private pedidoService: PedidosService,
    private commonService: CommonService,
    private regionService: RegionService,
  ) {}

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
      this.regiones = regiones
      this.regionReady = false
      if (this.regiones.length > 0) this.getPedidos()
    })
  }

  async getPedidos() {
    const fecha = await this.pedidoService.formatDate(new Date())
    if (this.pedidoSub) this.pedidoSub.unsubscribe()
    this.pedidoSub = this.pedidoService.getPedidos(fecha).subscribe((pedidos: Pedido[]) => {
      this.pedidos = pedidos
    })
  }

  // Mapa
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


  // Tracks

  trackByRepartidor(index:number, el: RepartidorAsociado): string {
    return el.id
  }

  trackByPedido(index:number, el: Pedido): string {
    return el.id
  }

  trackByRegion(index:number, el: Region): string {
    return el.referencia
  }

}
