import { TestBed, inject } from '@angular/core/testing';

import { OffresEmploiService } from './offres-emploi.service';

describe('OffresEmploiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OffresEmploiService]
    });
  });

  it('should be created', inject([OffresEmploiService], (service: OffresEmploiService) => {
    expect(service).toBeTruthy();
  }));
});
