import { TestBed } from '@angular/core/testing';

import { SubprogramaService } from './subprograma.service';

describe('SubprogramasService', () => {
  let service: SubprogramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubprogramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
