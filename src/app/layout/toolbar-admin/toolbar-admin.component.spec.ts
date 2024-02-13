import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarAdminComponent } from './toolbar-admin.component';

describe('ToolbarAdminComponent', () => {
  let component: ToolbarAdminComponent;
  let fixture: ComponentFixture<ToolbarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
