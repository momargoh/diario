import { TestBed } from '@angular/core/testing';

import { DoNotShowAgainService } from './do-not-show-again.service';

describe('DoNotShowAgainService', () => {
  let service: DoNotShowAgainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoNotShowAgainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
