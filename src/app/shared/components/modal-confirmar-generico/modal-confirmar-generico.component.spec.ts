import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmarGenericoComponent } from './modal-confirmar-generico.component';

describe('ModalConfirmarGenericoComponent', () => {
  let component: ModalConfirmarGenericoComponent;
  let fixture: ComponentFixture<ModalConfirmarGenericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConfirmarGenericoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmarGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
