import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaniersListComponent } from './paniers-list.component';

describe('PaniersListComponent', () => {
  let component: PaniersListComponent;
  let fixture: ComponentFixture<PaniersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaniersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaniersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
