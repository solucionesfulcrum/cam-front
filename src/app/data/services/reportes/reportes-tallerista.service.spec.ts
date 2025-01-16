import { TestBed } from '@angular/core/testing';

import { ReportesTalleristaService } from './reportes-tallerista.service';

describe('ReportesTalleristaService', () => {
  let service: ReportesTalleristaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportesTalleristaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
