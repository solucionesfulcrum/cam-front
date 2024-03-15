import { TestBed } from '@angular/core/testing';

import { StorageClientService } from './storage-client.service';

describe('StorageClientService', () => {
  let service: StorageClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
