import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.modal.html',
  styleUrls: ['./crop-image.modal.scss'],
})
export class CropImageModal implements OnInit {

  @Input() maintainAspectRatio: boolean
  @Input() imageChangedEvent
  @Input() aspect


  croppedImage: any = ''
  imageReady = false
  preview = false


  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  imageLoaded() {
    this.imageReady = true
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64
  }

  save() {
    this.modalCtrl.dismiss(this.croppedImage)
  }

  close() {
    this.modalCtrl.dismiss()
  }

}
