import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { RepartidorAsociado } from '../interface/repartidor.interface';


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


}
