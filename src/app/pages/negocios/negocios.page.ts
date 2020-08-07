import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HostListener } from "@angular/core";

import { NegocioPage } from 'src/app/modals/negocio/negocio.page';

import { NegociosService } from 'src/app/services/negocios.service';
import { CommonService } from 'src/app/services/common.service';

import { NegocioPreview, NegocioPerfil, Categoria } from 'src/app/interface/negocio.interface';
import { Ubicacion } from 'src/app/interface/region.interface';
import { CategoriaPage } from 'src/app/modals/categoria/categoria.page';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.page.html',
  styleUrls: ['./negocios.page.scss'],
})
export class NegociosPage implements OnInit {

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.scrHeight = window.innerHeight
    this.scrWidth = window.innerWidth
}

  scrHeight: number
  scrWidth: number

  negocios: NegocioPreview[] = []
  negocios_unauthorized: NegocioPreview[] = []
  negocio_perfil: NegocioPerfil
  negocio_preview: NegocioPreview

  region: string

  categoria: string
  categorias: Categoria[] = []
  verCategorias = false

  cargando_negocios = false

  enable_toogle = false

  centro: Ubicacion = {
    lat: 0,
    lng: 0
  }

  icon_destino = '../../../assets/img/casa_pin.png'
  icon_origen = '../../../assets/img/negocio_pin.png'

  batch = 24
  lastKey = ''
  noMore = false

  hideMainCol = false

  constructor(
    private modalCtrl: ModalController,
    private negocioService: NegociosService,
    private commonService: CommonService,
  ) { this.getScreenSize() }

  ngOnInit() {
  }

  async setRegion(region: string) {
    if (this.region === region) return
    this.negocios = []
    this.negocio_perfil = null
    this.region = region
    this.categorias = []
    this.categoria = ''
    this.getCategorias()
    this.negocios_unauthorized = await this.negocioService.getSuspendidos(this.region)

  }

  async getCategorias() {
    this.cargando_negocios = true
    this.categorias = await this.negocioService.getCategorias(this.region)
    this.cargando_negocios = false
  }

  async setCategoria(categoria: string) {
    if (this.categoria === categoria) return
    this.categoria = categoria
    this.cargando_negocios = true
    this.negocios = []
    this.getNegocios()
  }

  getNegocios() {
    this.negocioService.getNegocios(this.region, this.categoria, this.batch + 1, this.lastKey)
    .then(negocios => {
      if (negocios) {
        if (negocios.length === this.batch + 1) {
          this.lastKey = negocios[negocios.length - 1].id
          negocios.pop()
        } else {
          this.noMore = true
        }
        this.negocios = this.negocios.concat(negocios)
        this.cargando_negocios = false
        this.verCategorias = false
      } else {
        this.noMore = true
        this.cargando_negocios = false
      }
    })
  }

  async verNegocio(negocio: NegocioPreview) {
    this.enable_toogle = false
    this.negocio_preview = negocio
    this.negocio_perfil = await this.negocioService.getDetallesNegocio(negocio.id)
    if (this.scrWidth < 992) this.hideMainCol = true
    setTimeout(() => this.enable_toogle = true, 500)
  }

  regresa() {
    this.negocio_perfil = null
    this.hideMainCol = false
  }

  async nuevoNegocio() {
    const negocio: NegocioPerfil = {
      abierto: false,
      autorizado: true,
      categoria: this.categoria,
      plan: 'basico',
      correo: '',
      descripcion: '',
      direccion: {
        direccion: '',
        lat: null,
        lng: null
      },
      id: '',
      logo: '',
      portada: '',
      productos: 0,
      subCategoria: [],
      nombre: '',
      pass: '',
      region: this.region,
      contacto: '',
      telefono: '',
      tipo: 'servicios',
      entrega: '',
      formas_pago: {
        efectivo: false,
        tarjeta: false,
        terminal: false,
      },
      repartidores_propios: true,
    }
    const modal = await this.modalCtrl.create({
      component: NegocioPage,
      cssClass: 'modal_file',
      componentProps: {negocio}
    })

    return await modal.present()
  }

  async nuevaCategoria() {
    const modal = await this.modalCtrl.create({
      component: CategoriaPage,
      componentProps: {region: this.region}
    })

    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        this.commonService.presentToast('Categoría agregada')
        this.categorias.unshift(resp.data)
      }
    })

    return await modal.present()
  }

  async setHabilitado(value: boolean) {
    if (!this.enable_toogle) return
    this.enable_toogle = false
    try {
      await this.commonService.presentLoading('Estamos actualizando la información por favor espere')
      await this.negocioService.setHabilitado(this.negocio_preview.id, value)
      if (value) {
        if (this.categoria && this.categoria === this.negocio_perfil.categoria) this.negocios.push(this.negocio_preview)
        await this.negocioService.activa(this.region, this.negocio_preview.id, this.negocio_preview, this.negocio_perfil)
        this.negocios_unauthorized = this.negocios_unauthorized.filter(n => n.id !== this.negocio_preview.id)
      } else {
        this.negocios_unauthorized.push(this.negocio_preview)
        await this.negocioService.suspende(this.region, this.negocio_preview.id, this.negocio_preview, this.categoria, this.negocio_perfil)
        this.negocios = this.negocios.filter(n => n.id !== this.negocio_preview.id)
      }
      this.commonService.dismissLoading()
      this.negocio_perfil = null
    } catch (error) {
      this.commonService.dismissLoading()
    }
  }

  loadMoreNegocios() {
    if (this.noMore) return
    this.getNegocios()
  }

  // Tracks

  trackByNegocio(index:number, el: NegocioPreview): string {
    return el.id
  }

  trackByUnauthorized(index:number, el: NegocioPreview): string {
    return el.id
  }

}
