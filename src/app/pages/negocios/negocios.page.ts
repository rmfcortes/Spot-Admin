import { Component, OnInit } from '@angular/core';

import { NegociosService } from 'src/app/services/negocios.service';
import { CommonService } from 'src/app/services/common.service';

import { NegocioPreview, NegocioPerfil } from 'src/app/interface/negocio.interface';
import { Ubicacion } from 'src/app/interface/region.interface';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.page.html',
  styleUrls: ['./negocios.page.scss'],
})
export class NegociosPage implements OnInit {

  negocios: NegocioPreview[] = []
  negocios_unauthorized: NegocioPreview[] = []
  negocio_perfil: NegocioPerfil
  negocio_preview: NegocioPreview

  region: string

  categoria: string
  categorias: string[] = []
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

  constructor(
    private negocioService: NegociosService,
    private commonService: CommonService,
  ) { }

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
    setTimeout(() => this.enable_toogle = true, 500)
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
