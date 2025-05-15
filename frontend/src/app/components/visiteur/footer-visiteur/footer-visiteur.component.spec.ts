import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterVisiteurComponent } from './footer-visiteur.component';

describe('FooterVisiteurComponent', () => {
  let component: FooterVisiteurComponent;
  let fixture: ComponentFixture<FooterVisiteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterVisiteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterVisiteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
