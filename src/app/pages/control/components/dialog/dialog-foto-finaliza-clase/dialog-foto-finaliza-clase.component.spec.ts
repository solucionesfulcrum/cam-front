import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFotoFinalizaClaseComponent } from './dialog-foto-finaliza-clase.component';

describe('DialogFotoFinalizaClaseComponent', () => {
  let component: DialogFotoFinalizaClaseComponent;
  let fixture: ComponentFixture<DialogFotoFinalizaClaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFotoFinalizaClaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFotoFinalizaClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
