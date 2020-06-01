import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { UidService } from './uid.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authChecked = false

  constructor(
    private db: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private uidService: UidService,
  ) { }

  getAuthChecked() {
    return this.authChecked
  }

  setAuthChecked() {
    this.authChecked = true
  }

  async checkFireAuthTest() {
    return new Promise((resolve, reject) => {
      const authSub = this.angularFireAuth.authState.subscribe(async (resp) => {
        authSub.unsubscribe();
        this.setAuthChecked()
        resolve(resp)
      },
        err => reject(err)
      );
    });
  }

  checkUser(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let user;
      user = this.uidService.getUid()
      if (user) return resolve(true)
      user = await this.getUser()
      if (user) return resolve(true)
      const persitent = localStorage.getItem('persistent')
      if (persitent) {
        user = await this.revisaFireAuth()
        if (user) return resolve(true)
      }
      return resolve(false);
    });
  }

  async getUser() {
    return new Promise (async (resolve, reject) => {
      const uid = await localStorage.getItem('uid')
      if (uid) {
        const nombre = await localStorage.getItem('nombre')
        this.uidService.setUid(uid)
        this.uidService.setNombre(nombre)
        resolve(true)
      } else resolve(false)
    });
  }

  async revisaFireAuth() {
    return new Promise((resolve, reject) => {
      const authSub = this.angularFireAuth.authState.subscribe(async (user) => {
        authSub.unsubscribe();
        if (user) {
          if (localStorage.getItem('persistent')) this.persitent(user.uid, user.displayName)
          else this.notPersitent(user.uid, user.displayName)
          resolve(true);
        } else {
          resolve(false)
        }
      });
    });
  }

  async signInWithEmail(data): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await this.angularFireAuth.signInWithEmailAndPassword(data.email, data.password)
        await this.checkIsAdmin(resp.user.uid)
        if (data.isPersistent) this.persitent(resp.user.uid, resp.user.displayName)
        else this.notPersitent(resp.user.uid, resp.user.displayName)
        resolve(true);
      } catch (error) {
        if (error.code) {
          switch (error.code) {
            case 'auth/invalid-email':
             reject('Correo inválido')
              break;
            case 'auth/user-disabled':
             reject('Usuario deshabilitado')
              break;
            case 'auth/user-not-found':
             reject('Usuario no encontrado en la base de datos')
              break;
            case 'auth/wrong-password':
             reject('Contraseña incorrecta')
              break;
            default:
             reject('Lo sentimos, surgió un error inesperado. ' + error)
              break;
          }
        } else reject('Lo sentimos, surgió un error inesperado. ' + error)
      }
    });
  }

  checkIsAdmin(uid: string) {
    return new Promise((resolve, reject) => {
      const adminSub = this.db.object(`admin/${uid}`).valueChanges()
      .subscribe(async (admin) => {
        adminSub.unsubscribe()
        if (admin) resolve(true)
        else {
          await this.logout()
          reject('El usuario no cuenta con permisos de administrador para entrar en esta cuenta')
        }
      })
    });
  }

  persitent(uid, nombre) {
    return new Promise (async (resolve, reject) => {
      localStorage.setItem('uid', uid)
      localStorage.setItem('nombre', nombre)
      localStorage.setItem('persistent', 'true')
      this.uidService.setUid(uid)
      this.uidService.setNombre(nombre)
      resolve()
    });
  }

  notPersitent(uid, nombre) {
    return new Promise (async (resolve, reject) => {
      localStorage.removeItem('persistent')
      this.uidService.setUid(uid)
      this.uidService.setNombre(nombre)
      resolve()
    })
  }

  async logout() {
    return new Promise(async (resolve, reject) => {
      try {
        setTimeout(async () => {
          await this.angularFireAuth.signOut()
          localStorage.removeItem('uid')
          localStorage.removeItem('nombre')
          localStorage.removeItem('persistent')
          this.uidService.setUid(null)
          this.uidService.setNombre(null)
          resolve()
        }, 500)
      } catch (error) {
        reject(error)
      }
    });
  }

  async resetPassword(email) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.angularFireAuth.sendPasswordResetEmail(email)
        resolve()
      } catch (error) {
        reject(error)
      }
    });
  }



}
