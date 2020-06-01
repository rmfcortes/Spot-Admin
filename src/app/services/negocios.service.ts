import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { NegocioPreview, NegocioPerfil, Oferta, MasVendidos, InfoFunction, NegocioSuspendido, Busqueda } from '../interface/negocio.interface';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  constructor(private db: AngularFireDatabase) { }

  getSuspendidos(region: string): Promise<NegocioPreview[]> {
    return new Promise((resolve, reject) => {
      const suSub = this.db.list(`perfiles_suspendidos/${region}/previews`).valueChanges().subscribe((suspendidos: NegocioPreview[]) => {
        suSub.unsubscribe()
        resolve(suspendidos)
      })
    })
  }

  getCategorias(region: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const catSub = this.db.object(`categoria/${region}`).valueChanges().subscribe(categorias => {
        catSub.unsubscribe()
        resolve(Object.keys(categorias))
      })
    })
  }

  getNegocios(region: string, categoria: string, batch: number, lastKey: string): Promise<NegocioPreview[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`negocios/preview/${region}/${categoria}/todos`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey)).valueChanges()
          .subscribe(data => {
            x.unsubscribe()
            const negocios = []
            if (data.length > 1) resolve (negocios.concat(Object.values(data[0])).concat(Object.values(data[1])))
            else resolve(negocios.concat(Object.values(data[0])))
          })
      } else {
        const x = this.db.list(`negocios/preview/${region}/${categoria}/todos`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges()
          .subscribe(data => {
            x.unsubscribe()
            const negocios = []
            if (data.length > 1) resolve (negocios.concat(Object.values(data[0])).concat(Object.values(data[1])))
            else resolve(negocios.concat(Object.values(data[0])))
          })
      }
    })
  }

  getDetallesNegocio(idNegocio: string): Promise<NegocioPerfil>  {
    return new Promise((resolve, reject) => {
      const perSub = this.db.object(`perfiles/${idNegocio}`).valueChanges().subscribe((perfil: NegocioPerfil) => {
        perSub.unsubscribe()
        resolve(perfil)
      })
    })
  }

  setHabilitado(idNegocio: string, value: boolean) {
    this.db.object(`perfiles/${idNegocio}/autorizado`).set(value)
  }

  // Activa

  activa(region: string, idNegocio: string, preview: NegocioPreview, perfil: NegocioPerfil) {
    return new Promise(async (resolve, reject) => {
      try {
        const detalles: NegocioSuspendido = await this.getInfoSuspendido(region, idNegocio)
        await this.setInfo(region, idNegocio, detalles)
        await this.db.object(`perfiles_suspendidos/${region}/previews/${idNegocio}`).remove()
        await this.db.object(`perfiles_suspendidos/${region}/detalles/${idNegocio}`).remove()
        resolve()
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  getInfoSuspendido(region: string, idNegocio: string): Promise<NegocioSuspendido> {
    return new Promise((resolve, reject) => {
      const suSub = this.db.object(`perfiles_suspendidos/${region}/detalles/${idNegocio}`).valueChanges().subscribe((detalles: NegocioSuspendido) => {
        suSub.unsubscribe()
        resolve(detalles)
      })
    })
  }

  setInfo(region: string, idNegocio: string, negocio: NegocioSuspendido) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`busqueda/${region}/${idNegocio}`).set(negocio.busqueda)
        await this.db.object(`functions/${region}/${idNegocio}`).set(negocio.functions)
        if (negocio.ofertas) {
          for (const oferta of negocio.ofertas) {
            await this.db.object(`ofertas/${region}/${oferta.categoria}/${oferta.id}`).set(oferta)
            await this.db.object(`ofertas/${region}/todas/${oferta.id}`).set(oferta)
          }
        }
        if (negocio.vendidos) {
          for (const vendido of negocio.vendidos) {
            await this.db.object(`vendidos/${region}/${vendido.id}`).set(vendido)
          }
        }
        let status
        if (negocio.functions.abierto) status = 'abiertos'
        else status = 'cerrados'
        for (const subCategoria of negocio.perfil.subCategoria) {
          await this.db.object(`negocios/preview/${region}/${negocio.perfil.categoria}/${subCategoria}/${status}/${idNegocio}`).set(negocio.preview)
        }
        await this.db.object(`negocios/preview/${region}/${negocio.perfil.categoria}/todos/${status}/${idNegocio}`).set(negocio.preview)
        for (const i of ['0', '1', '2', '3', '4', '5', '6']) {
          this.db.object(`horario/analisis/${i}/${idNegocio}/activo`).set(true)
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Suspende

  suspende(region: string, idNegocio: string, preview: NegocioPreview, categoria: string, perfil: NegocioPerfil) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.desActivaHorario(idNegocio)
        const ofertas: Oferta[] = await this.getOfertas(region, idNegocio)
        const busqueda: Busqueda = await this.getBusqueda(region, idNegocio)
        const vendidos: MasVendidos[] = await this.getVendidos(region, idNegocio)
        const functions: InfoFunction = await this.getFunctions(region, idNegocio)
        const suspendido: NegocioSuspendido = {
          ofertas,
          busqueda,
          vendidos,
          functions,
          preview,
          perfil
        }
        await this.db.object(`perfiles_suspendidos/${region}/previews/${idNegocio}`).set(preview)
        await this.db.object(`perfiles_suspendidos/${region}/detalles/${idNegocio}`).set(suspendido)
        await this.borraInfo(region, categoria, idNegocio, functions.abierto, ofertas, vendidos, perfil)
        resolve()
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  desActivaHorario(idNegocio: string) {
    return new Promise((resolve, reject) => {      
      for (const i of ['0', '1', '2', '3', '4', '5', '6']) {
        this.db.object(`horario/analisis/${i}/${idNegocio}/activo`).set(false)
      }
      resolve()
    })
  }

  getBusqueda(region: string, idNegocio: string): Promise<Busqueda> {
    return new Promise((resolve, reject) => {
      const busSub = this.db.object(`busqueda/${region}/${idNegocio}`).valueChanges().subscribe((busqueda: Busqueda) => {
        busSub.unsubscribe()
        resolve(busqueda)
      })
    })
  }

  getFunctions(region: string, idNegocio: string): Promise<InfoFunction> {
    return new Promise((resolve, reject) => {
      const funSub = this.db.object(`functions/${region}/${idNegocio}`).valueChanges().subscribe((infoFunctions: InfoFunction) => {
        funSub.unsubscribe()
        resolve(infoFunctions)
      })
    })
  }

  getOfertas(region: string, idNegocio: string): Promise<Oferta[]> {
    return new Promise((resolve, reject) => {
      const ofSub = this.db.list(`ofertas/${region}/todas`, ofertas => ofertas.orderByChild('idNegocio').equalTo(idNegocio))
      .valueChanges().subscribe((ofertas: Oferta[]) => {
        ofSub.unsubscribe()
        resolve(ofertas)
      })
    })
  }

  getVendidos(region: string, idNegocio: string): Promise<MasVendidos[]> {
    return new Promise((resolve, reject) => {
      const venSub = this.db.list(`vendidos/${region}`, vendidos => vendidos.orderByChild('idNegocio').equalTo(idNegocio))
      .valueChanges().subscribe((vendidos: MasVendidos[]) => {
        venSub.unsubscribe()
        resolve(vendidos)
      })
    })
  }

  borraInfo(region: string, categoria: string, idNegocio: string, abierto: boolean, ofertas: Oferta[], vendidos: MasVendidos[], perfil: NegocioPerfil) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`busqueda/${region}/${idNegocio}`).remove()
        await this.db.object(`functions/${region}/${idNegocio}`).remove()
        for (const oferta of ofertas) {
          this.db.object(`ofertas/${region}/${oferta.categoria}/${oferta.id}`).remove()
          this.db.object(`ofertas/${region}/todas/${oferta.id}`).remove()
        }
        for (const vendido of vendidos) {
          this.db.object(`vendidos/${region}/${vendido.id}`).remove()
        }
        let status
        if (abierto) status = 'abiertos'
        else status = 'cerrados'
        for (const subCategoria of perfil.subCategoria) {
          this.db.object(`negocios/preview/${region}/${categoria}/${subCategoria}/${status}/${idNegocio}`).remove()
        }
        this.db.object(`negocios/preview/${region}/${categoria}/todos/${status}/${idNegocio}`).remove()
        resolve()
      } catch (error) {
       reject(error) 
      }
    })
  }

}
