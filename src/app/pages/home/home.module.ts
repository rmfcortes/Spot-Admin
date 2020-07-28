import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { AgmCoreModule } from '@agm/core';

import { HomePageRoutingModule } from './home-routing.module';

import { environment } from 'src/environments/environment.prod';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMX, 'es-MX');

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
      libraries: ['drawing']
    }),
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers: [{provide: LOCALE_ID, useValue: "es-MX"}]
})
export class HomePageModule {}
