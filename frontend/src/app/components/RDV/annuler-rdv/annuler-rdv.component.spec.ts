import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulerRdvComponent } from './annuler-rdv.component';

describe('AnnulerRdvComponent', () => {
  let component: AnnulerRdvComponent;
  let fixture: ComponentFixture<AnnulerRdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnulerRdvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnulerRdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
