import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { AgmCoreModule } from '@agm/core';

import { HomePageRoutingModule } from './home-routing.module';

import { environment } from 'src/environments/environment.prod';


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
  declarations: [HomePage]
})
export class HomePageModule {}
