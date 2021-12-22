import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploiSearchFormComponent } from './emploi-search-form.component';

describe('EmploiSearchFormComponent', () => {
  let component: EmploiSearchFormComponent;
  let fixture: ComponentFixture<EmploiSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploiSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploiSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
