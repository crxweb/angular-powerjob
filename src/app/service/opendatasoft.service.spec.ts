import { TestBed, inject } from '@angular/core/testing';

import { OpendatasoftService } from './opendatasoft.service';

describe('OpendatasoftService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpendatasoftService]
    });
  });

  it('should be created', inject([OpendatasoftService], (service: OpendatasoftService) => {
    expect(service).toBeTruthy();
  }));
});
