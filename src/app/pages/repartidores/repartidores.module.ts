import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepartidoresPageRoutingModule } from './repartidores-routing.module';
import { FileViewerPageModule } from 'src/app/modals/file-viewer/file-viewer.module';

import { RepartidoresPage } from './repartidores.page';
import { RepartidorPageModule } from 'src/app/modals/repartidor/repartidor.module';

import { repartidoresListComponent } from 'src/app/components/repartidores-list/repartidores-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StarsComponent } from 'src/app/components/stars/stars.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FileViewerPageModule,
    RepartidorPageModule,
    RepartidoresPageRoutingModule
  ],
  declarations: [RepartidoresPage, repartidoresListComponent, StarsComponent]
})
export class RepartidoresPageModule {}
