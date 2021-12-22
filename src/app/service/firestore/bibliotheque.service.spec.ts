import { TestBed, inject } from '@angular/core/testing';

import { BibliothequeService } from './bibliotheque.service';

describe('BibliothequeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BibliothequeService]
    });
  });

  it('should be created', inject([BibliothequeService], (service: BibliothequeService) => {
    expect(service).toBeTruthy();
  }));
});
