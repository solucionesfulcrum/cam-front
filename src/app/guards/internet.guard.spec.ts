import { TestBed } from '@angular/core/testing';

import { InternetGuard } from './internet.guard';

describe('InternetGuard', () => {
  let guard: InternetGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InternetGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
