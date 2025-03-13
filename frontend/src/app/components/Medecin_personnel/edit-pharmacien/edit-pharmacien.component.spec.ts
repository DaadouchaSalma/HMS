import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPharmacienComponent } from './edit-pharmacien.component';

describe('EditPharmacienComponent', () => {
  let component: EditPharmacienComponent;
  let fixture: ComponentFixture<EditPharmacienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPharmacienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPharmacienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
