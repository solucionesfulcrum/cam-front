import { TestBed } from '@angular/core/testing';

import { DarDeBajaService } from './dar-de-baja.service';

describe('DarDeBajaService', () => {
  let service: DarDeBajaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DarDeBajaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
