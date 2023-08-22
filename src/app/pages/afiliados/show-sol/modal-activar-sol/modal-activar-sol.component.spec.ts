import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActivarSolComponent } from './modal-activar-sol.component';

describe('ModalActivarSolComponent', () => {
  let component: ModalActivarSolComponent;
  let fixture: ComponentFixture<ModalActivarSolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalActivarSolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalActivarSolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
