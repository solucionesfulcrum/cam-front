import { TestBed } from '@angular/core/testing';

import { SubProgramaService } from './sub-programa.service';

describe('SubProgramaService', () => {
  let service: SubProgramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubProgramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
