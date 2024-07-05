import { TestBed } from '@angular/core/testing';

import { UnipileService } from './unipile.service';

describe('UnipileService', () => {
  let service: UnipileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnipileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
