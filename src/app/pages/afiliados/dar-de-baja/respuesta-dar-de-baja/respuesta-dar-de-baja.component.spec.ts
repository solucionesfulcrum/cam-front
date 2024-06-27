import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaDarDeBajaComponent } from './respuesta-dar-de-baja.component';

describe('RespuestaDarDeBajaComponent', () => {
  let component: RespuestaDarDeBajaComponent;
  let fixture: ComponentFixture<RespuestaDarDeBajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespuestaDarDeBajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespuestaDarDeBajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
