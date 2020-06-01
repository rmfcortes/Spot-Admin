import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegociosPageRoutingModule } from './negocios-routing.module';
import { AgmCoreModule } from '@agm/core';

import { NegociosPage } from './negocios.page';

import { SharedModule } from 'src/app/shared/shared.module';
import { CategoriaPageModule } from 'src/app/modals/categoria/categoria.module';
import { NegocioPageModule } from 'src/app/modals/negocio/negocio.module';

import { NegocioSelectedComponent } from 'src/app/components/negocio-selected/negocio-selected.component';

import { environment } from 'src/environments/environment.prod';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NegocioPageModule,
    CategoriaPageModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
    }),
    NegociosPageRoutingModule
  ],
  declarations: [NegociosPage, NegocioSelectedComponent]
})
export class NegociosPageModule {}
