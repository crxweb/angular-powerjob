import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDefaultComponent } from './modal-default.component';

describe('ModalDefaultComponent', () => {
  let component: ModalDefaultComponent;
  let fixture: ComponentFixture<ModalDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
