import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { Repartidor } from '../interface/pedido.interface';


@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getRepartidoresActivos(region: string) {
    return this.db.list(`repartidores_asociados_data/${region}`).valueChanges()
  }

  getRepartidorInfo(idRepartidor: string): Promise<Repartidor> {
    return new Promise((resolve, reject) => {
      const repSub = this.db.object(`repartidores_asociados_info/${idRepartidor}`)
      .valueChanges().subscribe((repartidor: Repartidor) => {
        repSub.unsubscribe()
        resolve(repartidor)
      })
    });
  }

}
