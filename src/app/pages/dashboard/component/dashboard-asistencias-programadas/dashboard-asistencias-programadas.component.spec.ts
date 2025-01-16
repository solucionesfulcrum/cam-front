import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAsistenciasProgramadasComponent } from './dashboard-asistencias-programadas.component';

describe('DashboardAsistenciasProgramadasComponent', () => {
  let component: DashboardAsistenciasProgramadasComponent;
  let fixture: ComponentFixture<DashboardAsistenciasProgramadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAsistenciasProgramadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAsistenciasProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
