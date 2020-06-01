import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepartidoresPageRoutingModule } from './repartidores-routing.module';

import { RepartidoresPage } from './repartidores.page';

import { repartidoresListComponent } from 'src/app/components/repartidores-list/repartidores-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepartidoresPageRoutingModule
  ],
  declarations: [RepartidoresPage, repartidoresListComponent]
})
export class RepartidoresPageModule {}
