import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/database';

import { RepartidorAsociado } from '../interface/repartidor.interface';


@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {

  repSub: Subscription;

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getRepartidoresActivos(region: string): Promise<RepartidorAsociado[]> {
    return new Promise((resolve, reject) => {
      if (this.repSub) this.repSub.unsubscribe()
      this.repSub = this.db.list(`repartidores_asociados_data/${region}`).valueChanges()
      .subscribe((repartidores: RepartidorAsociado[]) => {
        resolve(repartidores)
      })
    });
  }


}
