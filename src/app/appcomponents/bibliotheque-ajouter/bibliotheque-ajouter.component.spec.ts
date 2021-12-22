import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliothequeAjouterComponent } from './bibliotheque-ajouter.component';

describe('BibliothequeAjouterComponent', () => {
  let component: BibliothequeAjouterComponent;
  let fixture: ComponentFixture<BibliothequeAjouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibliothequeAjouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliothequeAjouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
