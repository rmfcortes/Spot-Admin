import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegocioPage } from './negocio.page';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment.prod';
import { CropImageModalModule } from '../crop-image/crop-image.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropImageModalModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
      libraries: ['places']
    }),
  ],
  declarations: [NegocioPage],
  entryComponents: [NegocioPage]
})
export class NegocioPageModule {}
