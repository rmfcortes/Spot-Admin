import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LoadingController, AlertController, ToastController } from '@ionic/angular';

import { Region } from '../interface/region.interface';



@Injectable({
  providedIn: 'root'
})
export class CommonService {

  loader: any

  regiones: Region[] = []

  constructor(
    private title: Title,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  setTitle(title: string) {
    this.title.setTitle(title)
  }

  setRegiones(regiones: Region[]) {
    this.regiones = regiones
  }

  getRegiones() {
    return this.regiones
  }

  async presentLoading(message?: string) {
    this.loader = await this.loadingCtrl.create({
     spinner: 'dots',
     message
    });
    return await this.loader.present();
  }

  dismissLoading() {
    if (this.loader) this.loader.dismiss();
  }

  async presentAlertAction(titulo: string, msn: string, btnOk: string, btnCancelar: string) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: titulo,
        message: msn,
        buttons: [
          {
            text: btnCancelar,
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              resolve(false);
            }
          },
          {
            text: btnOk,
            cssClass: 'secondary',
            handler: (blah) => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();
    });
  }

  async presentAlert(titulo, msn) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msn,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
        }
      ]
    });

    await alert.present();
  }

  async presentAlertRadio(msn, inputs) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        message: msn,
        inputs,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              resolve(false);
            }
          }, {
            text: 'Asignar',
            handler: (data) => {
              resolve(data);
            }
          }
        ]
      });

      await alert.present();
    });
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present()
  }

}
