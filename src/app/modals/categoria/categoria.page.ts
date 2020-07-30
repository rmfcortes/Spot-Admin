import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CropImageModal } from '../crop-image/crop-image.modal';

import { Categoria } from 'src/app/interface/negocio.interface';
import { CommonService } from 'src/app/services/common.service';
import { NegociosService } from 'src/app/services/negocios.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  @Input() region: string
  no_image = '../../../assets/img/no-image-cover.png'

  categoria: Categoria = {
    categoria: '',
    foto: '',
    cantidad: 0
  }
  subCategorias: string[] = []
  subCategoria = ''
  file: string

  loading = false

  constructor(
    private modalCtrl: ModalController,
    private categoriaService: NegociosService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
  }

  async setIcon(event) {
    this.file = event.target.files[0]
  }

  addSubCategoria() {
    this.subCategoria = this.subCategoria.trim()
    if (!this.subCategoria) return
    this.subCategorias.unshift(this.subCategoria)
    this.subCategoria = ''
  }

  borrarSubCategoria(i: number) {
    this.subCategorias.splice(i, 1)
  }

  async guardar() {
    this.loading = true
    try {
      this.categoria.foto = await this.categoriaService.uploadIcon(this.file, this.categoria.categoria, this.region)
      await this.categoriaService.setCategoria(this.categoria, this.region)
      await this.categoriaService.setSubCategorias(this.categoria, this.subCategorias, this.region)
      this.loading = false
      this.modalCtrl.dismiss(this.categoria)
    } catch (error) {
      this.loading = false
      this.commonService.presentAlert('', 'Ha ocurrido un error ' + error)
    }
  }

  salir() {
    this.modalCtrl.dismiss()
  }

}
