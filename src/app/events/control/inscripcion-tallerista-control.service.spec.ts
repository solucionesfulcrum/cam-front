import { TestBed } from '@angular/core/testing';

import { InscripcionTalleristaControlService } from './inscripcion-tallerista-control.service';

describe('InscripcionTalleristaControlService', () => {
  let service: InscripcionTalleristaControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscripcionTalleristaControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
