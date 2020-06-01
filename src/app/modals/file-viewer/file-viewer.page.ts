import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.page.html',
  styleUrls: ['./file-viewer.page.scss'],
})
export class FileViewerPage implements OnInit {

  @Input() archivo

  constructor(
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.archivo = this.sanitizer.bypassSecurityTrustResourceUrl(this.archivo)
  }

  regresar() {
    this.modalCtrl.dismiss()
  }

}
