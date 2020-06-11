import { Component, OnInit, Input, AfterViewInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';

import { CropImageModal } from '../crop-image/crop-image.modal';

import { NegociosService } from 'src/app/services/negocios.service';
import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/region.service';

import { NegocioPerfil } from 'src/app/interface/negocio.interface';
import { Region } from 'src/app/interface/region.interface';

@Component({
  selector: 'app-negocio',
  templateUrl: './negocio.page.html',
  styleUrls: ['./negocio.page.scss'],
})
export class NegocioPage implements OnInit, AfterViewInit {

  @Input() negocio: NegocioPerfil

  region: Region
  polygon: any
  cobertura = false

  noLogo = '../../../assets/img/no-logo.png'
  noPortada = '../../../assets/img/no-portada.png'

  base64Portada = ''
  base64Logo = ''

  subCategorias: string[] = []

  constructor(
    private ngZone: NgZone,
    private modalCtrl: ModalController,
    private mapsAPILoader: MapsAPILoader,
    private negocioService: NegociosService,
    private regionService: RegionService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.getPolygon()
    this.getSubcategorias()
  }

  async getPolygon() {
    this.region = await this.regionService.getRegion(this.negocio.region)
    this.polygon = new google.maps.Polygon({paths: this.region.ubicacion})
  }

  async getSubcategorias() {
    this.subCategorias = await this.negocioService.getSubCategorias(this.negocio.categoria, this.negocio.region)
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setAutocomplete()
    }, 350)
  }

    // Autocomplete
  setAutocomplete() {
    this.mapsAPILoader.load().then(async () => {
      const inputBox = document.getElementById('txtEscritorio').getElementsByTagName('input')[0]
      const autocompleteEscritorio = new google.maps.places.Autocomplete(inputBox, {types: ['address']})
      autocompleteEscritorio.addListener('place_changed', () => {
          this.ngZone.run(async () => {
              // get the place result
              const place: google.maps.places.PlaceResult = autocompleteEscritorio.getPlace()
              // verify result
              if (place.geometry === undefined || place.geometry === null) return
              // set latitude, longitude and zoom
              const lat = place.geometry.location.lat()
              const lng = place.geometry.location.lng()
              const dentro = await google.maps.geometry.poly.containsLocation(place.geometry.location, this.polygon)
              if (dentro) {
                this.negocio.direccion.lat = lat
                this.negocio.direccion.lng = lng
                this.negocio.direccion.direccion = place.formatted_address
                this.cobertura = true
              } else {
                this.negocio.direccion.lat = null
                this.negocio.direccion.direccion = ''
                this.commonService.presentAlert('Fuera de cobertura', 'La dirección está muy lejos de la región elegida ' +
                'Cambia de región o espera a que Spot llegue a tu región')
                this.cobertura = false
              }
          })
      })
      
    })
  }

    //Edita imagenes
  async cropImage(imageChangedEvent, aspect, portada, quality?, width?) {
    const modal = await this.modalCtrl.create({
      component: CropImageModal,
      componentProps: {imageChangedEvent, aspect, quality, width, maintainAspectRatio: true}
    })
    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        if (portada) {
          this.negocio.portada = resp.data
          this.base64Portada = resp.data.split('data:image/png;base64,')[1]
        } else {
          this.negocio.logo = resp.data
          this.base64Logo = resp.data.split('data:image/png;base64,')[1]
        }
      }
    })
    return await modal.present()
  }

  async guardaLoc(evento) {
    this.negocio.direccion.lat = evento.coords.lat
    this.negocio.direccion.lng = evento.coords.lng
  }


  async guardar() {
    if (!this.base64Logo) {
      this.commonService.presentAlert('Agrega tu logotipo', 'Antes de continuar por favor agrega una imagen en tu logotipo')
      return
    }    
    if (!this.base64Portada) {
      this.commonService.presentAlert('Agrega tu logotipo', 'Antes de continuar por favor agrega una imagen en tu logotipo')
      return
    }
    let permitidos
    switch (this.negocio.plan) {
      case 'basico':
        permitidos = 1
        break;
      case 'pro':
        permitidos = 4
        break
      case 'premium':
        permitidos = 500
        break
    }
    const agregados = this.negocio.subCategoria.length;
    if (agregados > permitidos) {
      this.commonService.presentAlert('Límite de subCategorías', `Tu plan actual es ${this.negocio.plan}. Y sólo puedes
      agregar ${permitidos} subCategoria(s). Si deseas agregar más, contacta a tu vendedor y actualiza tu plan`)
      return
    }
    this.negocio.telefono = this.negocio.telefono.replace(/ /g, "")
    if (this.negocio.telefono.length !== 10) {
      this.commonService.presentAlert('Número incorrecto', 'El teléfono debe ser de 10 dígitos, por favor intenta de nuevo')
      return
    }    
    if (this.negocio.whats) {
      this.negocio.whats = this.negocio.whats.replace(/ /g, "")
      if (this.negocio.whats.length !== 10) {
        this.commonService.presentAlert('Número incorrecto', 'El teléfono debe ser de 10 dígitos, por favor intenta de nuevo')
        return
      }
    }
    await this.commonService.presentLoading()
    if (this.negocio.repartidores_propios === 'true') this.negocio.repartidores_propios = true
    else this.negocio.repartidores_propios = false
    try {
      // Guarda fotos y obtiene urls
      this.negocio.portada = await this.negocioService.uploadFoto(this.base64Portada, 'portada')
      this.negocio.logo = await this.negocioService.uploadFoto(this.base64Logo, 'logo')
      const result = await this.negocioService.nuevoNegocio(this.negocio)
      this.commonService.dismissLoading()
      switch (result) {
        case 'auth/email-already-exists':
          this.borraFotos()
          this.commonService.presentAlert('Usuario registrado',
            'El usuario que intentas registrar corresponde a una cuenta existente. Intenta con otro')
          break
        case 'auth/invalid-email':
          this.borraFotos()
          this.commonService.presentAlert('Email inválido', 'El correo que intentas registrar no corresponde a un email válido')
          break
        case 'auth/invalid-password':
          this.borraFotos()
          this.commonService.presentAlert('Contraseña insegura', 'La contraseña debe tener al menos 6 caracteres')
          break;
        case 'ok':
          this.modalCtrl.dismiss(this.negocio)
          this.commonService.presentToast('Cambios guardados')
          break
        default:
          this.borraFotos()
          this.commonService.presentAlert('Error', 'Algo salió mal, por favor intenta de nuevo')
          break
      }
    } catch (error) {
      this.commonService.dismissLoading()
      this.commonService.presentAlert('Error', 'Algo salió mal, por favor intenta de nuevo. ' + error)
    }
  }

  borraFotos() {
    this.negocioService.borraFoto(this.negocio.portada)
    this.negocioService.borraFoto(this.negocio.logo)
  }

  salir() {
    this.modalCtrl.dismiss()
  }

}
