import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedNotifsComponent } from './med-notifs.component';

describe('MedNotifsComponent', () => {
  let component: MedNotifsComponent;
  let fixture: ComponentFixture<MedNotifsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedNotifsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedNotifsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
