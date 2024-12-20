import { TestBed } from '@angular/core/testing';

import { AsistenciaRapidaGuard } from './asistencia-rapida.guard';

describe('AsistenciaRapidaGuard', () => {
  let guard: AsistenciaRapidaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AsistenciaRapidaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
