import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MenuController } from '@ionic/angular';

import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup
  validation_messages: any
  err: string
  persistent = true

  constructor(
    private router: Router,
    private menu: MenuController,
    private alertService: CommonService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.setForm()
  }

  ionViewWillEnter() {
    this.alertService.setTitle('Spot admin - login')
    this.menu.enable(false)
  }

  setForm() {
    this.form = new FormGroup({
      'email': new FormControl('', Validators.compose([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      'isPersistent': new FormControl(true)
    },
    { updateOn: 'blur'})

    this.validation_messages = {
      'email': [
          { type: 'required', message: 'Este campo es necesario' },
          { type: 'pattern', message: 'El correo ingresado no corresponde a una direccion correcta' },
        ],
        'password': [
          { type: 'required', message: 'Este campo es requerido' },
          { type: 'minlength', message: 'La contraseña debe tener al menos 6 caracteres' },
        ],
      }
  }

  async signIn() {
    this.form.controls.email.markAsTouched()
    this.form.controls.password.markAsTouched()
    if (!this.form.valid) return
    await this.alertService.presentLoading()
    this.err = ''
    this.authService.signInWithEmail(this.form.value)
    .then(() => {
      this.alertService.dismissLoading()
      this.router.navigate(['home'])
    })
    .catch((err) => {
      this.alertService.dismissLoading()
      this.err = err
    })
  }

  resetPassword() {
    this.err = ''
    this.form.controls.email.markAsTouched()
    if (!this.form.controls.email.valid) return
    this.authService.resetPassword(this.form.value.email)
    .then(() =>  this.err = 'Hemos enviado un enlace al correo electrónico para reingresar una contraseña')
    .catch(err => this.err = err)
  }

}
