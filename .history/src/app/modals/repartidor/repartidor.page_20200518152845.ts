import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { CropImageModal } from '../crop-image/crop-image.modal';

import { RepartidoresService } from 'src/app/services/repartidores.service';
import { CommonService } from 'src/app/services/common.service';

import { RepartidorInfo } from 'src/app/interface/repartidor.interface';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.page.html',
  styleUrls: ['./repartidor.page.scss'],
})
export class RepartidorPage implements OnInit {

  @Input()region: string
  @Input()repartidor: RepartidorInfo

  noPhoto = '../../../assets/img/no-image-cover.png'

  base64: string
  licencia: any

  constructor(
    private modalCtrl: ModalController,
    private repartidorService: RepartidoresService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
  }

  async cropImage(imageChangedEvent, aspect, maintainAspectRatio) {
    const modal = await this.modalCtrl.create({
      component: CropImageModal,
      componentProps: {imageChangedEvent, aspect, maintainAspectRatio}
    });
    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        this.repartidor.preview.foto = resp.data;
        this.base64 = resp.data.split('data:image/png;base64,')[1];
      }
    });
    return await modal.present();
  }

  async setArchivo(event) {
    this.licencia = event.target.files[0]
  }

  async guardar() {
    await this.commonService.presentLoading()
    try {
      if (!this.base64 && !this.repartidor.preview.foto) {
        this.commonService.dismissLoading()
        this.commonService.presentAlert('', 'Por favor sube una foto de perfil')
        return
      }
      if (this.repartidor.detalles.vehiculo === 'moto' && !this.licencia && !this.repartidor.detalles.licencia) {
        this.commonService.dismissLoading()
        this.commonService.presentAlert('', 'Por favor sube un documento con la licencia de conducir')
        return
      }
      if (this.base64) {
        this.repartidor = await this.repartidorService.guardaFoto(this.base64, this.region, this.repartidor)
      }
      if (this.licencia) {
        this.repartidor = await this.repartidorService.guardaLicencia(this.region, this.repartidor, this.licencia)
      }
      await this.repartidorService.guardaRepartidor(this.region, this.repartidor)
      this.commonService.dismissLoading()
      this.commonService.presentToast('Cambios guardados')
      this.salir(this.repartidor)
    } catch (error) {
      this.commonService.dismissLoading()
      this.commonService.presentAlert('Error', 'Algo salió mal, por favor intenta de nuevo. ' + error)
    }
  }

  eliminarRepartidor() {
    this.commonService.presentAlertAction('', `Estás seguro(a) de eliminar a ${this.repartidor.preview.nombre}.
    Su información se perderá de forma permanente. Si su suspensión es temporal, Deshabilita su cuenta para que
    no pueda recibir viajes hasta que lo creas conveniente`, 'Eliminar', 'Cancelar')
    .then(resp => {
      if (resp) {
        this.repartidorService.eliminarRepartidor(this.region, this.repartidor)
        this.commonService.presentToast('Repartidor eliminado')
        this.modalCtrl.dismiss('Eliminado')
      }
    })
  }

  salir(repartidor: RepartidorInfo) {
    this.modalCtrl.dismiss(repartidor)
  }

}
