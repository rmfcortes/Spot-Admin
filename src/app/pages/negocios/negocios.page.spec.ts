import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NegociosPage } from './negocios.page';

describe('NegociosPage', () => {
  let component: NegociosPage;
  let fixture: ComponentFixture<NegociosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegociosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NegociosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
