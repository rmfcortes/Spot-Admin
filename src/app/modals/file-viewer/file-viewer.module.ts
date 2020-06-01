import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FileViewerPage } from './file-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [FileViewerPage],
  entryComponents: [FileViewerPage]
})
export class FileViewerPageModule {}
