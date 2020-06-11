import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { createAnimation, Animation} from '@ionic/core';


@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent implements OnChanges {

  @Input() calificacion;
  @Input() readOnly;
  @Output() calficar = new EventEmitter<number>();

  promedio = 5;

  constructor() {}

  ngOnChanges() {
    if (this.calificacion === 0.1) {
      this.promedio = 0.1;
    } else if (this.calificacion > 0 && this.calificacion < 1) {
      this.promedio = 0.5;
    } else if (this.calificacion === 1) {
      this.promedio = 1;
    } else if (this.calificacion > 1 && this.calificacion < 2) {
      this.promedio = 1.5;
    } else if (this.calificacion === 2) {
      this.promedio = 2;
    } else if (this.calificacion > 2 && this.calificacion < 3) {
      this.promedio = 2.5;
    } else if (this.calificacion === 3) {
      this.promedio = 3;
    } else if (this.calificacion > 3 && this.calificacion < 4) {
      this.promedio = 3.5;
    } else if (this.calificacion === 4) {
      this.promedio = 4;
    } else if (this.calificacion > 4 && this.calificacion < 5) {
      this.promedio = 4.5;
    } else if (this.calificacion === 5) {
      this.promedio = 5;
    }
  }

  calificar(calificacion: number, id) {
    if (this.readOnly) return;
    this.promedio = calificacion
    setTimeout(() => {      
      const tit = document.getElementById(id)
      this.animBrincaPoco(tit)
      this.calficar.emit(calificacion)
    }, 100);
  }

  animBrincaPoco(element) {
    createAnimation()
      .addElement(element)
      .duration(500)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'scale(0.9)', opacity: '0.5' },
        { offset: 0.5, transform: 'scale(1.5)', opacity: '1' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
      ])
      .play()
  }

}
