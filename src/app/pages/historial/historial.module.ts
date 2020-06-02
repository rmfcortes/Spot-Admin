import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialPageRoutingModule } from './historial-routing.module';

import { HistorialPage } from './historial.page';
import { SharedModule } from '../../shared/shared.module';

import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment.prod';
import { TripSelectedComponent } from 'src/app/components/trip-selected/trip-selected.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
    }),
    HistorialPageRoutingModule
  ],
  declarations: [HistorialPage, TripSelectedComponent]
})
export class HistorialPageModule {}
