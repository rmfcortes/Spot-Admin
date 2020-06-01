import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { CropImageModal } from '../crop-image/crop-image.modal';

import { RepartidorInfo } from 'src/app/interface/repartidor.interface';
import { CommonService } from 'src/app/services/common.service';

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

  constructor(
    private modalCtrl: ModalController,
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

  async guardar() {
    await this.commonService.presentLoading()
    try {
      if (this.base64) {
        this.repartidor = 
      }
    } catch (error) {
      this.commonService.dismissLoading()
      this.commonService.presentAlert('Error', 'Algo salió mal, por favor intenta de nuevo. ' + error)
    }
  }

  eliminarRepartidor() {

  }

  salir() {
    this.modalCtrl.dismiss()
  }

}
