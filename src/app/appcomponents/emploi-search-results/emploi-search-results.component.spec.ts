import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploiSearchResultsComponent } from './emploi-search-results.component';

describe('EmploiSearchResultsComponent', () => {
  let component: EmploiSearchResultsComponent;
  let fixture: ComponentFixture<EmploiSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploiSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploiSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
