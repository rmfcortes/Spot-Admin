import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DriverInfo } from 'src/app/interface/driver.interface';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss'],
})
export class DriversListComponent implements OnInit {

  @Input() titulo: string;
  @Input() drivers: DriverInfo[]
  @Output() driverSelected = new EventEmitter<DriverInfo>()

  idDriver: string

  constructor() { }

  ngOnInit() {}

  driverSel(driver: DriverInfo) {
    this.idDriver = driver.uid
    this.driverSelected.emit(driver)
  }

  trackByDriver(index:number, el: DriverInfo): string {
    return el.uid
  }


}
