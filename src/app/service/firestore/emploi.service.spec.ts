import { TestBed, inject } from '@angular/core/testing';

import { EmploiService } from './emploi.service';

describe('EmploiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmploiService]
    });
  });

  it('should be created', inject([EmploiService], (service: EmploiService) => {
    expect(service).toBeTruthy();
  }));
});
