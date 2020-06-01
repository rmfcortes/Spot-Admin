import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { RegionService } from 'src/app/services/region.service';


@Component({
  selector: 'app-region-selector',
  templateUrl: './region-selector.component.html',
  styleUrls: ['./region-selector.component.scss'],
})
export class RegionSelectorComponent implements OnInit {

  @Output() region_selected = new EventEmitter<string>()

  regiones: string[]
  region: string
  verRegiones = false

  constructor(
    private commonService: CommonService,
    private regionService: RegionService,
  ) { }

  ngOnInit() {
    this.getRegiones()
  }

  async getRegiones() {
    this.regiones = []
    const regiones = await this.commonService.getRegiones()
    if (regiones.length === 0) {
      this.regionService.getRegiones()
      .then(regionesDB => {
        this.commonService.setRegiones(regionesDB)
        for (const region of regionesDB) {
          this.regiones.push(region.referencia)
        }
      })
    } else {
      for (const region of regiones) {
        this.regiones.push(region.referencia)
      }
    }
  }

  setRegion(region: string) {
    this.verRegiones = false
    this.region = region
    this.region_selected.next(region)
  }

}
