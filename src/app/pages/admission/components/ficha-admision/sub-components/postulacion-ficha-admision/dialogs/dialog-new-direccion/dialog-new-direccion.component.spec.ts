import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewDireccionComponent } from './dialog-new-direccion.component';

describe('DialogNewDireccionComponent', () => {
  let component: DialogNewDireccionComponent;
  let fixture: ComponentFixture<DialogNewDireccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewDireccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNewDireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
