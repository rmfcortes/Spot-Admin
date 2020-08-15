import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NegocioPerfil } from 'src/app/interface/negocio.interface';

@Component({
  selector: 'app-negocio-selected',
  templateUrl: './negocio-selected.component.html',
  styleUrls: ['./negocio-selected.component.scss'],
})
export class NegocioSelectedComponent implements OnInit {

  @Input() negocio: NegocioPerfil
  @Output() guardar = new EventEmitter<NegocioPerfil>()


  constructor() { }

  ngOnInit() {}

  guardarCambios() {
    this.guardar.emit(this.negocio)
  }

}
