/// <reference types="@types/google.maps" />

import { TestBed } from '@angular/core/testing';

import { GoogleMapsDataService } from './google-maps-data.service';
import { GoogleMapsModule } from '@angular/google-maps';

describe('GoogleMapsDataService', () => {
  let service: GoogleMapsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleMapsDataService],
      imports: [GoogleMapsModule]
    });
    service = TestBed.inject(GoogleMapsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
