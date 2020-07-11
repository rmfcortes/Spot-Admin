import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriaPage } from './categoria.page';
import { CropImageModalModule } from '../crop-image/crop-image.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropImageModalModule,
  ],
  declarations: [CategoriaPage],
  entryComponents: [CategoriaPage]
})
export class CategoriaPageModule {}
