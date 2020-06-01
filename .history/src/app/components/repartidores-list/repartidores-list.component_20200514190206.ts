import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RepartidorPreview } from 'src/app/interface/repartidor.interface';


@Component({
  selector: 'app-repartidores-list',
  templateUrl: './repartidores-list.component.html',
  styleUrls: ['./repartidores-list.component.scss'],
})
export class repartidoresListComponent implements OnInit {

  @Input() repartidores: RepartidorPreview[]
  @Output() repartidor_selected = new EventEmitter<RepartidorPreview>()

  idRepartidor: string

  constructor() { }

  ngOnInit() {}

  repartidorSel(repartidor: RepartidorPreview) {
    this.idRepartidor = repartidor.id
    this.repartidor_selected.emit(repartidor)
  }

  trackByrepartidor(index:number, el: RepartidorPreview): string {
    return el.id
  }


}
