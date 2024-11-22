import { TestBed } from '@angular/core/testing';

import { CarteraDeServiciosService } from './cartera-de-servicios.service';

describe('CarteraDeServiciosService', () => {
  let service: CarteraDeServiciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarteraDeServiciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
