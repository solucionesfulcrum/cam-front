import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesOperativasMainComponent } from './unidades-operativas-main.component';

describe('UnidadesOperativasMainComponent', () => {
  let component: UnidadesOperativasMainComponent;
  let fixture: ComponentFixture<UnidadesOperativasMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadesOperativasMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadesOperativasMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
