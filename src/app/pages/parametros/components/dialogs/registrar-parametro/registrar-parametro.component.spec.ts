import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarParametroComponent } from './registrar-parametro.component';

describe('RegistrarParametroComponent', () => {
  let component: RegistrarParametroComponent;
  let fixture: ComponentFixture<RegistrarParametroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarParametroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
