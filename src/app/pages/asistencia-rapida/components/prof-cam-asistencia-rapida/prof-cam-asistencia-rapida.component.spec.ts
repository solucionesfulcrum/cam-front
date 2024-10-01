import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfCamAsistenciaRapidaComponent } from './prof-cam-asistencia-rapida.component';

describe('ProfCamAsistenciaRapidaComponent', () => {
  let component: ProfCamAsistenciaRapidaComponent;
  let fixture: ComponentFixture<ProfCamAsistenciaRapidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfCamAsistenciaRapidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfCamAsistenciaRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
