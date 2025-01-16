import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSubprogramasComponent } from './lista-subprogramas.component';

describe('ListaSubprogramasComponent', () => {
  let component: ListaSubprogramasComponent;
  let fixture: ComponentFixture<ListaSubprogramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaSubprogramasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaSubprogramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
