import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambreEditComponent } from './chambre-edit.component';

describe('ChambreEditComponent', () => {
  let component: ChambreEditComponent;
  let fixture: ComponentFixture<ChambreEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChambreEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChambreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
