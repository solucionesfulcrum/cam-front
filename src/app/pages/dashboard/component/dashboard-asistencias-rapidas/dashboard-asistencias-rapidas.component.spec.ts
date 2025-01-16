import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAsistenciasRapidasComponent } from './dashboard-asistencias-rapidas.component';

describe('DashboardAsistenciasRapidasComponent', () => {
  let component: DashboardAsistenciasRapidasComponent;
  let fixture: ComponentFixture<DashboardAsistenciasRapidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAsistenciasRapidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAsistenciasRapidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
