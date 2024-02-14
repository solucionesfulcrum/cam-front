import { TestBed } from '@angular/core/testing';

import { AdmServiceService } from './adm-service.service';

describe('AdmServiceService', () => {
  let service: AdmServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
