import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCiramComponent } from './list-ciram.component';

describe('ListCiramComponent', () => {
  let component: ListCiramComponent;
  let fixture: ComponentFixture<ListCiramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCiramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCiramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
