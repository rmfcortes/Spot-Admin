import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.page.html',
  styleUrls: ['./repartidor.page.scss'],
})
export class RepartidorPage implements OnInit {

  @Input()region: string

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  salir() {
    this.modalCtrl.dismiss()
  }

}
