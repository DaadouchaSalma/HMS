import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinAjoutComponent } from './medecin-ajout.component';

describe('MedecinAjoutComponent', () => {
  let component: MedecinAjoutComponent;
  let fixture: ComponentFixture<MedecinAjoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedecinAjoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinAjoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
