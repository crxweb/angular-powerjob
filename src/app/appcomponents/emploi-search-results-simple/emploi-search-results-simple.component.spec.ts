import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploiSearchResultsSimpleComponent } from './emploi-search-results-simple.component';

describe('EmploiSearchResultsSimpleComponent', () => {
  let component: EmploiSearchResultsSimpleComponent;
  let fixture: ComponentFixture<EmploiSearchResultsSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploiSearchResultsSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploiSearchResultsSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
