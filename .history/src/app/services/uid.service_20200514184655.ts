import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Region } from '../interface/region.interface';

@Injectable({
  providedIn: 'root'
})
export class UidService {

  uid: string
  nombre: string
  token = false
  regiones: Region[] = []

  constructor( ) {  }

  setUid(uid) {
    this.uid = uid
  }

  getUid() {
    return this.uid
  }

  setNombre(nombre) {
    this.nombre = nombre
  }

  getNombre() {
    return this.nombre;
  }

  setToken() {
    this.token = true
  }

  getToken() {
    return this.token
  }

  setRegiones(regiones: Region[]) {
    this.regiones = regiones
  }

  getRegiones() {
    return this.regiones
  }


  
}
