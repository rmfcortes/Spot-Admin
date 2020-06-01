import { Component, OnInit, Input } from '@angular/core';

import { Ubicacion } from 'src/app/interface/region.interface';
import { Pedido } from 'src/app/interface/pedido.interface';

@Component({
  selector: 'app-trip-selected',
  templateUrl: './trip-selected.component.html',
  styleUrls: ['./trip-selected.component.scss'],
})
export class TripSelectedComponent implements OnInit {

  @Input() pedido_selected: Pedido

  centro: Ubicacion = {
    lat: 0,
    lng: 0
  }

  icon_destino = '../../../assets/img/casa_pin.png'
  icon_origen = '../../../assets/img/negocio_pin.png'

  constructor() { }

  ngOnInit() {
    console.log(this.pedido_selected)
  }

}
