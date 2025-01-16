import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalleristasComponent } from './talleristas.component';

describe('TalleristasComponent', () => {
  let component: TalleristasComponent;
  let fixture: ComponentFixture<TalleristasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalleristasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalleristasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
