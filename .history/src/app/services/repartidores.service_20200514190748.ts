import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { RepartidorPreview } from '../interface/repartidor.interface';


@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // Home Page

  getRepartidoresActivos(region: string) {
    return this.db.list(`repartidores_asociados_data/${region}`).valueChanges()
  }

  getRepartidorInfo(idRepartidor: string, region: string): Promise<RepartidorPreview> {
    return new Promise((resolve, reject) => {
      const repSub = this.db.object(`repartidores_asociados_info/${region}/preview/${idRepartidor}`)
      .valueChanges().subscribe((repartidor: RepartidorPreview) => {
        repSub.unsubscribe()
        resolve(repartidor)
      })
    });
  }

  // Repartidores page

  getRepartidoresPreview(region: string, batch: number, lastKey: string): Promise<RepartidorPreview[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`repartidores_asociados_info/${region}/preview`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey)).valueChanges()
          .subscribe(async (repartidores: RepartidorPreview[]) => {
            x.unsubscribe();
            resolve(repartidores);
          });
      } else {
        const x = this.db.list(`repartidores_asociados_info/${region}/preview`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges()
          .subscribe(async (repartidores: RepartidorPreview[]) => {
            x.unsubscribe();
            resolve(repartidores);
          });
      }
    })
  }

}
