import { TestBed } from '@angular/core/testing';

import { DMEService } from './dme.service';

describe('DMEService', () => {
  let service: DMEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DMEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
