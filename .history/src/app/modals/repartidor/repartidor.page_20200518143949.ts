import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { CropImageModal } from '../crop-image/crop-image.modal';

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

  constructor(
    private modalCtrl: ModalController
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

  guardar() {
    
  }

  eliminarRepartidor() {

  }

  salir() {
    this.modalCtrl.dismiss()
  }

}
