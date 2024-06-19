import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesTalleristaComponent } from './reportes-tallerista.component';

describe('ReportesTalleristaComponent', () => {
  let component: ReportesTalleristaComponent;
  let fixture: ComponentFixture<ReportesTalleristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesTalleristaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesTalleristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
