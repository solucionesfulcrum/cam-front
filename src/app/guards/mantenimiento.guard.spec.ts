import { TestBed } from '@angular/core/testing';

import { MantenimientoGuard } from './mantenimiento.guard';

describe('MantenimientoGuard', () => {
  let guard: MantenimientoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MantenimientoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
