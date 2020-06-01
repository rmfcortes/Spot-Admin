import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MenuController } from '@ionic/angular';

import { } from 'googlemaps';

import { RepartidoresService } from 'src/app/services/repartidores.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/region.service';

import { Pedido, PedidoPendiente } from 'src/app/interface/pedido.interface';
import { RepartidorAsociado, RepartidorPreview } from 'src/app/interface/repartidor.interface';
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
  nueva_region = false

  pedidos: PedidoPendiente[] = []
  pedido: Pedido
  
  repartidores: RepartidorAsociado[]
  radioRepartidores = []
  repartidor: RepartidorPreview
  repSub: Subscription

  map: any
  centro: Ubicacion = {
    lat: 0,
    lng: 0
  }
  openedPedidoWindow: number
  openedWindow: number

  ciudad: string
  referencia: string

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
      if (this.regiones.length > 0) this.listenPedidos()
    })
  }

  async listenPedidos() {
    const fecha = await this.pedidoService.formatDate(new Date())
    this.pedidoService.listenPedidos(fecha).off('child_added')
    this.pedidoService.listenPedidos(fecha).off('child_removed')
    this.pedidoAdded(fecha)
    
  }

  pedidoAdded(fecha: string) {
    this.pedidoService.listenPedidos(fecha).on('child_added', snapshot => {
      const pedido: Pedido = snapshot.val()
      const iRegion = this.regiones.findIndex(r => r.referencia === pedido.region)
      if (this.pedidos.length === 0) {
        this.pedidos = [{
          region: pedido.region,
          pedidos: [pedido]
        }]
        this.regiones[iRegion].pedidos = 1
      } else {
        const i = this.pedidos.findIndex(p => p.region === pedido.region)
        if (i >= 0) {
          this.pedidos[i].pedidos.concat(pedido)
          this.regiones[iRegion].pedidos++
        }
        else {
          this.pedidos.push({region: pedido.region, pedidos: [pedido]})
          this.regiones[iRegion].pedidos = 1
        }
      }
    })
  }

  pedidoRemoved(fecha: string) {
    this.pedidoService.listenPedidos(fecha).on('child_removed', snapshot => {
      const pedido_eliminado: Pedido = snapshot.val()
      const iRegion = this.regiones.findIndex(r => r.referencia === pedido_eliminado.region)
      this.regiones[iRegion].pedidos -= 1
      this.pedidos = this.pedidos.map(p => {
        const pedido: PedidoPendiente ={
          pedidos: [],
          region: p.region,
        }
        pedido.pedidos = p.pedidos.filter(pe => pe.id !== pedido_eliminado.id)
        if (pedido.pedidos.length > 0) return pedido
        else return null
      })
    })
  }

  // Acciones
  getRepartidores(i: number) {
    this.openedWindow = null
    if (this.repSub) this.repSub.unsubscribe()
    this.repSub = this.repartidoresService.getRepartidoresActivos(this.regiones[i].referencia)
    .subscribe((repartidores: RepartidorAsociado[]) => {
      this.repartidores = repartidores
      if (this.repartidores.length === 0) {
        const polygon = new google.maps.Polygon({paths: this.regiones[i].ubicacion})
        this.map.fitBounds(this.getPolygonBounds(polygon))
      }
    })
  }

  getRadioRepartidores() {
    this.radioRepartidores = []
    for (let i = 0; i < this.repartidores.length; i++) {
      const input = {
        name: `radio${i}`,
        type: 'radio',
        label: this.repartidores[i].nombre,
        value: this.repartidores[i].id,
      }
      this.radioRepartidores.push(input)
    }
  }

  getPolygonBounds(polygon: google.maps.Polygon) {
    const bounds = new google.maps.LatLngBounds()
    const paths = polygon.getPaths()
    let path: any
    for (let i = 0; i < paths.getLength(); i++) {
      path = paths.getAt(i)
      for (let ii = 0; ii < path.getLength(); ii++) {
        bounds.extend(path.getAt(ii))
      }
    }
    return bounds
  }

  nuevaZona() {
    if (!this.ciudad) {
      this.commonService.presentAlert('', 'Agrega el nombre de la ciudad')
      return
    }
    if (!this.referencia) {
      this.commonService.presentAlert('', 'Agrega una referencia')
      return
    }
    this.initDrawingManager()
  }

  initDrawingManager() {
    this.commonService.presentAlert('', 'Dibuja un polígono para delimitar tu zona de cobertura. Da click en el perímetro de tu zona de trabajo')
    const options: google.maps.drawing.DrawingManagerOptions = {
      drawingControl: false,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        draggable: false,
        editable: true,
        fillColor: 'var(--ion-color-secondary)',
        strokeColor: 'var(--ion-color-primary)'
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    }

    const drawingManager = new google.maps.drawing.DrawingManager(options)
    drawingManager.setMap(this.map)
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
      if (event.type === 'polygon') {
        this.commonService.presentAlertAction('', '¡Perfecto!, tu zona de cobertura ha sido delimitada. ¿Deseas guardarla o intentar de nuevo?',
        'Guardar', 'Intentar de nuevo')
        .then(async (resp) => {
          if (resp) {
            drawingManager.setDrawingMode(null)
            const path =  event.overlay.getPath()
            const new_region: Region = {
              centro: null,
              ciudad: this.ciudad,
              referencia: this.referencia,
              ubicacion: []
            }
            for (let i = 0; i < path.length; i++) {
              new_region.ubicacion.push({
                lat: path.getAt(i).lat(),
                lng: path.getAt(i).lng()
              })
            }
            new_region.centro = await this.getCentro(new_region.ubicacion)
            this.regionService.setRegion(new_region)
            event.overlay.setMap(null)
            this.regiones.push(new_region)
            this.ciudad = ''
            this.referencia = ''
            this.nueva_region = false
          } else {
            event.overlay.setMap(null)
            this.initDrawingManager()
          }
        })
      }
    })
  }

  getCentro(cobertura: Ubicacion[]): Promise<Ubicacion> {
    return new Promise((resolve, reject) => {
      let sumX = 0
      let sumY = 0
      for (let i = 0; i < cobertura.length; i++) {
        const point = cobertura[i];
        const x = point.lat;
        const y = point.lng;
        sumX += x;
        sumY += y;
      }
      const centro: Ubicacion = {
        lat: sumX / cobertura.length,
        lng: sumY / cobertura.length
      }
      resolve(centro)
    });
  }

  verInfoRepartidor(i: number, idRepartidor: string) {
    this.repartidoresService.getRepartidorInfo(idRepartidor, this.pedido.region)
    .then(repartidor => {
      this.openedWindow = i
      this.repartidor = repartidor
    })
  }

  asignarPedido() {
    if (this.radioRepartidores.length === 0) {
      this.commonService.presentAlert('', 'No hay repartidores disponibles para asignar viaje')
      return
    }
    this.commonService.presentAlertRadio('Asignar a:', this.radioRepartidores)
    .then((resp: string) => {
      if (resp) {
        const i = this.pedidos.findIndex(p => p.region === this.pedido.region)
        if (i >= 0) {
          const y = this.pedidos[i].pedidos.findIndex(p => p.id === this.pedido.id)
          if (y >= 0 && !this.pedidos[i].pedidos[y].repartidor) {
            this.pedidoService.asignarPedido(resp, this.pedidos[i].pedidos[y].id)
          } else {
            this.commonService.presentAlert('', 'El servicio fue cancelado por el usuario o ya fue tomado por algún repartidor') 
          }
        } else {
          this.commonService.presentAlert('', 'El servicio fue cancelado por el usuario o ya fue tomado por algún repartidor')
        }
      }
    })
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
