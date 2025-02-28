import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultBreadcrumbComponent } from './default-breadcrumb.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DefaultBreadcrumbComponent', () => {
  let component: DefaultBreadcrumbComponent;
  let fixture: ComponentFixture<DefaultBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, DefaultBreadcrumbComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DefaultBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
