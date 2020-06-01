import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database/database';

import { Region } from '../interface/region.interface';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  getRegiones(): Promise<Region[]> {
    return new Promise((resolve, reject) => {
      const regSub = this.db.list(`ciudades`).valueChanges().subscribe((regiones: Region[]) => {
        regSub.unsubscribe()
        resolve(regiones)
      })
    });
  }


}
