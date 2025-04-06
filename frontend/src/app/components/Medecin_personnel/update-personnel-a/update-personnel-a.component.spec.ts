import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePersonnelAComponent } from './update-personnel-a.component';

describe('UpdatePersonnelAComponent', () => {
  let component: UpdatePersonnelAComponent;
  let fixture: ComponentFixture<UpdatePersonnelAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePersonnelAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePersonnelAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
