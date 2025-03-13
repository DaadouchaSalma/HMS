import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonnelAdminComponent } from './edit-personnel-admin.component';

describe('EditPersonnelAdminComponent', () => {
  let component: EditPersonnelAdminComponent;
  let fixture: ComponentFixture<EditPersonnelAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPersonnelAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPersonnelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
