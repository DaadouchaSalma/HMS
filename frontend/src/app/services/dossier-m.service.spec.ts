import { TestBed } from '@angular/core/testing';

import { DossierMService } from './dossier-m.service';

describe('DossierMService', () => {
  let service: DossierMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
