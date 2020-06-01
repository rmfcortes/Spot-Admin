import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { RepartidorPreview, RepartidorDetalles, RepartidorInfo } from '../interface/repartidor.interface';

@Injectable({
  providedIn: 'root'
})
export class RepartidoresService {

  constructor(
    private db: AngularFireDatabase,
    private fireStorage: AngularFireStorage,
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

  getRepartidorDetalles(idRepartidor: string, region: string): Promise<RepartidorDetalles> {
    return new Promise((resolve, reject) => {
      const repSub = this.db.object(`repartidores_asociados_info/${region}/detalles/${idRepartidor}`)
      .valueChanges().subscribe((repartidor: RepartidorDetalles) => {
        repSub.unsubscribe()
        resolve(repartidor)
      })
    })
  }

  getSuspendidos(region: string): Promise<RepartidorPreview[]> {
    return new Promise((resolve, reject) => {
      const repSub = this.db.list(`repartidores_asociados_info/${region}/suspendidos/preview`)
      .valueChanges().subscribe((repartidores: RepartidorPreview[]) => {
        repSub.unsubscribe()
        resolve(repartidores)
      })
    })
  }

  async suspende(repartidor: RepartidorInfo, region: string) {
    await this.db.object(`repartidores_asociados_info/${region}/suspendidos/detalles/${repartidor.preview.id}`).set(repartidor.detalles)
    await this.db.object(`repartidores_asociados_info/${region}/suspendidos/preview/${repartidor.preview.id}`).set(repartidor.preview)
    this.db.object(`repartidores_asociados_info/${region}/detalles/${repartidor.preview.id}`).remove()
    this.db.object(`repartidores_asociados_info/${region}/preview/${repartidor.preview.id}`).remove()
  }

  async reActiva(repartidor: RepartidorInfo, region: string) {
    await this.db.object(`repartidores_asociados_info/${region}/detalles/${repartidor.preview.id}`).set(repartidor.detalles)
    await this.db.object(`repartidores_asociados_info/${region}/preview/${repartidor.preview.id}`).set(repartidor.preview)
    this.db.object(`repartidores_asociados_info/${region}/suspendidos/detalles/${repartidor.preview.id}`).remove()
    this.db.object(`repartidores_asociados_info/${region}/suspendidos/preview/${repartidor.preview.id}`).remove()
  }

  // Repartidor modal

  guardaFoto(foto: string, region: string, repartidor: RepartidorInfo): Promise<any> {
    return new Promise (async (resolve, reject) => {
      if (!repartidor.preview.id) {
        repartidor.preview.id = this.db.createPushId()
      }
      const ref = this.fireStorage.ref(`repartidores/${region}/${repartidor.preview.id}/foto`)
      const task = ref.putString( foto, 'base64', { contentType: 'image/jpeg'} )

      const p = new Promise ((resolver, rejecte) => {
        const task2 = task.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await ref.getDownloadURL().toPromise()
            task2.unsubscribe()
            repartidor.preview.foto = downloadURL
            resolver(repartidor)
          })
          ).subscribe(
            x => { },
            err => {
              rejecte(err)
            }
          )
      })
      resolve(p)
    })
  }

  guardaLicencia(region: string, repartidor: RepartidorInfo, licencia): Promise<any> {
    return new Promise (async (resolve, reject) => {
      const ref = this.fireStorage.ref(`repartidores/${region}/${repartidor.preview.id}/licencia`)
      const task = ref.put( licencia )

      const p = new Promise ((resolver, rejecte) => {
        const tarea = task.snapshotChanges().pipe(
          finalize(async () => {
            repartidor.detalles.licencia = await ref.getDownloadURL().toPromise()
            tarea.unsubscribe()
            resolver(repartidor)
          })
          ).subscribe(
            x => { },
            err => {
              rejecte(err)
            }
          );
      });
      resolve(p)
    });
  }

  guardaRepartidor(region: string, repartidor: RepartidorInfo) {
    return new Promise(async (resolve, reject) => {
      await this.db.object(`repartidores_asociados_info/${region}/detalles/${repartidor.preview.id}`).set(repartidor.detalles)
      await this.db.object(`repartidores_asociados_info/${region}/preview/${repartidor.preview.id}`).set(repartidor.preview)
      resolve()
    });
  }

  eliminarRepartidor(region: string, repartidor: RepartidorInfo) {
    this.db.object(`repartidores_asociados_info/${region}/detalles/${repartidor.preview.id}`).remove()
    this.db.object(`repartidores_asociados_info/${region}/preview/${repartidor.preview.id}`).remove()
    this.borrarFoto(repartidor.preview.foto)
  }

  borrarFoto(foto: string) {
    this.fireStorage.storage.refFromURL(foto)
  }

}
