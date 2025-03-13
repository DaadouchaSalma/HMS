import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutMedComponent } from './ajout-med.component';

describe('AjoutMedComponent', () => {
  let component: AjoutMedComponent;
  let fixture: ComponentFixture<AjoutMedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutMedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutMedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
