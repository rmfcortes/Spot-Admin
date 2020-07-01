import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { HistorialService } from 'src/app/services/historial.service';
import { CommonService } from 'src/app/services/common.service';

import { Pedido, HistorialPedido } from 'src/app/interface/pedido.interface';
import { Ubicacion } from 'src/app/interface/region.interface';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  region: string

  first_date: string
  inicial_date: string
  end_date: string
  today: string
  
  repartidores: any[] = []
  repartidores_ready = false  
  negocios: any[] = []
  negocios_ready = false
  range_change_repartidores = false
  range_change_negocios = false

  loading_pedidos = false

  pedidos: HistorialPedido[] = []
  filtered_pedidos: HistorialPedido[] = []

  pedido: Pedido

  repartidor_selected: any
  ganancia_repartidor = 0
  completados = 0

  negocio_selected: any
  saldo_negocio = 0
  saldo_pendiente = 0
  comisiones = 0

  avatar: '../../../assets/img/avatar_cliente.png'
  icon_destino = '../../../assets/img/casa_pin.png'
  icon_origen = '../../../assets/img/negocio_pin.png'

  no_registros: string

  centro: Ubicacion = {
    lat: 0,
    lng: 0
  }

  constructor(
    private menu: MenuController,
    private historialService: HistorialService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.menu.enable(true)
    this.getToday()
  }

  async getFirstDate(region: string) {
    this.region = region
    this.pedidos = []
    this.pedido = null
    this.filtered_pedidos = []
    this.inicial_date = null
    this.end_date = null
    this.range_change_negocios = true
    this.range_change_repartidores = true
    this.first_date = localStorage.getItem('first_date')
    if (!this.first_date) this.first_date = await this.historialService.getFirstDate(region)
    if (!this.first_date) this.first_date = await this.historialService.setFirstDate(region)
    if (!this.first_date) this.no_registros = 'No hay registro de pedidos para esta region'
  }

  async getToday() {
    this.today = await this.historialService.formatDate(new Date())
  }

    ////////////////// Acciones
  // Get registros by range
  async initialDateCambio(value) {
    const date = new Date(value)
    this.inicial_date = await this.historialService.formatDate(date)
    if (this.end_date) {
      if (this.inicial_date > this.end_date) {
        this.commonService.presentAlert('', 'La fecha inicial no puede ser mayor a la fecha final')
        return
      }
      this.getRegistrosByRange()
    }
  }

  async endDateCambio(value) {
    const date = new Date(value)
    this.end_date = await this.historialService.formatDate(date)
    if (this.inicial_date) {
      if (this.inicial_date > this.end_date) {
        this.commonService.presentAlert('', 'La fecha inicial no puede ser mayor a la fecha final')
        return
      }
      this.getRegistrosByRange()
    }
  }

  async getRegistrosByRange() {
    this.loading_pedidos = true
    this.range_change_repartidores = true
    this.range_change_negocios = true
    this.pedidos = []
    this.pedidos = await this.historialService.getRegistrosByRange(this.region, this.inicial_date, this.end_date)
    if (this.pedidos.length > 0) this.no_registros = ''
    else this.no_registros = 'No hay registros de servicios en estos días'
    this.loading_pedidos = false
  }

  // Filter pedidos
  getRepartidoresNames() {
    if (this.range_change_repartidores) {
      this.range_change_repartidores = false
      this.repartidores = []
      for (const historial of this.pedidos) {
        for (const pedido of historial.pedidos) {
          if (pedido.repartidor) {
            const i = this.repartidores.findIndex(r => r.id === pedido.repartidor.id)
            if (i < 0) this.repartidores.push({nombre: pedido.repartidor.nombre, id: pedido.repartidor.id})
          }
        }
      }
      this.repartidores_ready = true
    } else this.repartidores_ready = true
  }

  getNegociosNames() {
    if (this.range_change_negocios) {
      this.range_change_negocios = false
      this.negocios = []
      for (const historial of this.pedidos) {
        for (const pedido of historial.pedidos) {
          const i = this.negocios.findIndex(n => n.id === pedido.negocio.idNegocio)
          if (i < 0) this.negocios.push({nombre: pedido.negocio.nombreNegocio, id: pedido.negocio.idNegocio})
        }
      }
      this.negocios_ready = true
    } else this.negocios_ready = true
  }

  filterPedidosByRepartidor(repartidor) {
    if (this.repartidor_selected === repartidor) return
    this.repartidor_selected = repartidor
    this.negocio_selected = null
    const array_vacio: any = []
    this.ganancia_repartidor = 0
    this.completados = 0
    this.filtered_pedidos = this.pedidos.map(el => {
      const historial: HistorialPedido = {
        fecha: el.fecha,
        pedidos: [],
        cancelados_negocio: [],
        cancelados_user: [],
        completados: [],
        ver_detalles: el.ver_detalles
      }
      historial.pedidos = el.pedidos.filter(p => p.repartidor && p.repartidor.id === repartidor.id)
      if (historial.pedidos) {
        historial.cancelados_negocio = el.cancelados_negocio.filter(p => p.repartidor && p.repartidor.id === repartidor.id)
        historial.cancelados_user = el.cancelados_user.filter(p => p.repartidor && p.repartidor.id === repartidor.id)
        historial.completados = el.completados.filter(p => {
          if (p.repartidor && p.repartidor.id === repartidor.id) {
            this.ganancia_repartidor += p.repartidor.ganancia ? p.repartidor.ganancia : 0
            this.completados++
            return p
          }
        })
        return historial
      } else array_vacio
    }).filter(h => h.pedidos.length > 0)

    this.repartidores_ready = false
  }

  filterPedidosByNegocio(negocio) {
    if (this.negocio_selected === negocio) return
    this.negocio_selected = negocio
    this.repartidor_selected = null
    const array_vacio: any = []
    this.saldo_pendiente = 0
    this.saldo_negocio = 0
    this.completados = 0
    this.filtered_pedidos = this.pedidos.map(el => {
      const historial: HistorialPedido = {
        fecha: el.fecha,
        pedidos: [],
        cancelados_negocio: [],
        cancelados_user: [],
        completados: [],
        ver_detalles: el.ver_detalles
      }
      historial.pedidos = el.pedidos.filter(p => p.negocio.idNegocio === negocio.id)
      if (historial.pedidos) {
        historial.cancelados_negocio = el.cancelados_negocio.filter(p => p.repartidor && p.repartidor.id === negocio.id)
        historial.cancelados_user = el.cancelados_user.filter(p => p.repartidor && p.repartidor.id === negocio.id)
        historial.completados = el.completados.filter(p => {
          if (p.negocio.idNegocio === negocio.id) {
            this.saldo_pendiente += p.formaPago.forma === 'efectivo' ? 0 : p.total
            this.saldo_negocio += p.entregado ? p.total : 0
            this.completados++
            return p
          }
        })
        return historial
      } else array_vacio
    }).filter(h => h.pedidos.length > 0)

    this.negocios_ready = false
  }

  verTodos() {
    this.repartidor_selected = null
    this.negocio_selected = null
    this.repartidores_ready = false
    this.negocios_ready = false
    this.filtered_pedidos = []
  }






}
