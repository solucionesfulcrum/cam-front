import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInactivosComponent } from './lista-inactivos.component';

describe('ListaInactivosComponent', () => {
  let component: ListaInactivosComponent;
  let fixture: ComponentFixture<ListaInactivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaInactivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
