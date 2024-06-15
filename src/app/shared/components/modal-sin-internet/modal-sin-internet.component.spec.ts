import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSinInternetComponent } from './modal-sin-internet.component';

describe('ModalSinInternetComponent', () => {
  let component: ModalSinInternetComponent;
  let fixture: ComponentFixture<ModalSinInternetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSinInternetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSinInternetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
