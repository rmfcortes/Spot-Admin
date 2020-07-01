import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { HistorialPedido, Pedido } from '../interface/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  // Historial page
  getFirstDate(region: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const dateSub = this.db.object(`first_date/${region}`).valueChanges().subscribe((date: string) => {
        dateSub.unsubscribe()
        resolve(date)
      })
    })
  }

  setFirstDate(region: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const dateSub = this.db.object(`pedidos/historial/${region}/por_fecha`).valueChanges().subscribe(historial => {
        dateSub.unsubscribe()
        if (historial) {
          const fechas = Object.entries(historial)
          if (fechas.length > 0) {
            const first_date = fechas[0][0]
            this.db.object('first_date').set(first_date)
            localStorage.setItem('first_date', first_date)
            resolve(first_date)
          } else {
            resolve(null)
          }
        } else resolve(null)
      })
    })
  }

  getRegistrosByRange(region: string, initial_date: string, end_date: string): Promise<HistorialPedido[]> {
    return new Promise((resolve, reject) => {
      const tripsSub = this.db.list(`pedidos/historial/${region}/por_fecha`, data => data.orderByKey().startAt(initial_date).endAt(end_date))
      .snapshotChanges().subscribe(resp => {
        tripsSub.unsubscribe()
        const trips: HistorialPedido[] = []
        for (const trip of resp) {
          const historial: HistorialPedido = {
            fecha: trip.key,
            pedidos: Object.values(trip.payload.val()),
            completados: Object.values(trip.payload.val()).filter(t => t.entregado),
            cancelados_negocio: Object.values(trip.payload.val()).filter(t => t.cancelado),
            cancelados_user: Object.values(trip.payload.val()).filter(t => t.cancelado_by_user),
            ver_detalles: false
          }
          trips.push(historial)
        }
        resolve(trips)
      })
    })
  }
  
  // getPedidosByRepartidor(region: string, idRepartidor: string, intial_date: string, end_date: string): Promise<HistorialPedido[]> {
  //   return new Promise((resolve, reject) => {
  //     const pedSub = this.db.list(`pedidos/historial/${region}/por_repartidor/${idRepartidor}`, pedidos => pedidos.orderByKey().startAt(intial_date).endAt(end_date))
  //     .valueChanges().subscribe((resp: Pedido[]) => {
  //       pedSub.unsubscribe()
  //       const pedidos: HistorialPedido[] = []
  //       for (const pedido of resp) {
  //         const historial: HistorialPedido = {
  //           pedidos: Object.values(pedido),
  //           completados: Object.values(pedido).filter(t => t.entregado),
  //           cancelados_driver: Object.values(pedido).filter(t => t.cancelado),
  //           cancelados_user: Object.values(pedido).filter(t => t.cancelado_by_user),
  //           ver_detalles: false
  //         }
  //         pedidos.push(historial)
  //       }
  //       resolve(pedidos)
  //     })
  //   })
  // }  

  // getPedidosByNegocio(region: string, idNegocio: string, intial_date: string, end_date: string): Promise<HistorialPedido[]> {
  //   return new Promise((resolve, reject) => {
  //     const pedSub = this.db.list(`pedidos/historial/${region}/por_negocio/${idNegocio}`, pedidos => pedidos.orderByKey().startAt(intial_date).endAt(end_date))
  //     .valueChanges().subscribe((resp: Pedido[]) => {
  //       pedSub.unsubscribe()
  //       const pedidos: HistorialPedido[] = []
  //       for (const pedido of resp) {
  //         const historial: HistorialPedido = {
  //           pedidos: Object.values(pedido),
  //           completados: Object.values(pedido).filter(t => t.entregado),
  //           cancelados_driver: Object.values(pedido).filter(t => t.cancelado),
  //           cancelados_user: Object.values(pedido).filter(t => t.cancelado_by_user),
  //           ver_detalles: false
  //         }
  //         pedidos.push(historial)
  //       }
  //       resolve(pedidos)
  //     })
  //   })
  // }
  
  formatDate(d: Date): Promise<string> {
    return new Promise((resolve, reject) => {        
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        const year = d.getFullYear()
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        resolve([year, month, day].join('-'))
    })
  }
  
}
