import { TestBed } from '@angular/core/testing';

import { ControlAptosService } from './control-aptos.service';

describe('ControlAptosService', () => {
  let service: ControlAptosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlAptosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
