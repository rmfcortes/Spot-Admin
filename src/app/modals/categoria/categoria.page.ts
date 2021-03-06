import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CropImageModal } from '../crop-image/crop-image.modal';

import { Categoria, SubCategoria } from 'src/app/interface/negocio.interface';
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
  subCategorias: SubCategoria[] = []
  alias: string
  subCategoria: string
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
    this.alias = this.alias.trim().toLowerCase()
    this.subCategoria = this.subCategoria.trim().toLowerCase()
    if (!this.subCategoria) return
    const sub: SubCategoria = {
      cantidad: 0,
      alias: this.alias,
      subCategoria: this.subCategoria,
    }
    this.subCategorias.unshift(sub)
    this.alias = ''
    this.subCategoria = ''
  }

  borrarSubCategoria(i: number) {
    this.subCategorias.splice(i, 1)
  }

  async guardar() {
    this.categoria.categoria = this.categoria.categoria.trim().toLowerCase()
    if (!this.categoria.categoria) return
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
