import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAsistenciasComponent } from './dashboard-asistencias.component';

describe('DashboardAsistenciasComponent', () => {
  let component: DashboardAsistenciasComponent;
  let fixture: ComponentFixture<DashboardAsistenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAsistenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
