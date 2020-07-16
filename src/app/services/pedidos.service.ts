import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Pedido } from '../interface/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // Home Page

  listenPedidos(fecha: string) {
    return this.db.list(`pedidos/seguimiento_admin/${fecha}`, data => data.orderByChild('repartidor').equalTo(null)).query.ref
  }

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
    });
  }

  asignarPedido(idRepartidor: string, pedido: Pedido) {
    this.db.object(`pendientes_aceptacion/${idRepartidor}/${pedido.id}`).set(pedido)
  }

}
