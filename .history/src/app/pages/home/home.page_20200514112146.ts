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

  regiones: Region[] = []
  pedidos: Pedido[] = []

  pedidoSub: Subscription

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


  trackByRepartidor(index:number, el: RepartidorAsociado): string {
    return el.id
  }


}
