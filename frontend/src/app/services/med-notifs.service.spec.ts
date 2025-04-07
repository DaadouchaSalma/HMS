import { TestBed } from '@angular/core/testing';

import { MedNotifsService } from './med-notifs.service';

describe('MedNotifsService', () => {
  let service: MedNotifsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedNotifsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
