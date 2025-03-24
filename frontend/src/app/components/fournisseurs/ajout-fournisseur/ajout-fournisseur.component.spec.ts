import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutFournisseurComponent } from './ajout-fournisseur.component';

describe('AjoutFournisseurComponent', () => {
  let component: AjoutFournisseurComponent;
  let fixture: ComponentFixture<AjoutFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutFournisseurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
