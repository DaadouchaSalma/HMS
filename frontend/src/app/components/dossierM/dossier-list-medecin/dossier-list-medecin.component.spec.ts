import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierListMedecinComponent } from './dossier-list-medecin.component';

describe('DossierListMedecinComponent', () => {
  let component: DossierListMedecinComponent;
  let fixture: ComponentFixture<DossierListMedecinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierListMedecinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DossierListMedecinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
