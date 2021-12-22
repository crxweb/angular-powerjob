import { TestBed, inject } from '@angular/core/testing';

import { GeoapigouvfrService } from './geoapigouvfr.service';

describe('GeoapigouvfrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeoapigouvfrService]
    });
  });

  it('should be created', inject([GeoapigouvfrService], (service: GeoapigouvfrService) => {
    expect(service).toBeTruthy();
  }));
});
