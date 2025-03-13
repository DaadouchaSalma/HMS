import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonnelAdminComponent } from './add-personnel-admin.component';

describe('AddPersonnelAdminComponent', () => {
  let component: AddPersonnelAdminComponent;
  let fixture: ComponentFixture<AddPersonnelAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPersonnelAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPersonnelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
