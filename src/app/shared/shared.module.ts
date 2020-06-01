import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RegionSelectorComponent } from '../components/region-selector/region-selector.component';


@NgModule({
    imports: [
      CommonModule,
      IonicModule,
    ],
    declarations: [
      RegionSelectorComponent
    ],
    exports: [
      RegionSelectorComponent
    ]
  })

  export class SharedModule {}
