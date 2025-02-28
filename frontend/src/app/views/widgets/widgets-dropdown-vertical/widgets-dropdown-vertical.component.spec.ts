import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonModule, DropdownModule, GridModule, WidgetModule } from '@coreui/angular-pro';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { iconSubset } from '../../../icons/icon-subset';
import { WidgetsDropdownVerticalComponent } from './widgets-dropdown-vertical.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('WidgetsDropdownVerticalComponent', () => {
  let component: WidgetsDropdownVerticalComponent;
  let fixture: ComponentFixture<WidgetsDropdownVerticalComponent>;
  let iconSetService: IconSetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsDropdownVerticalComponent, WidgetModule, DropdownModule, IconModule, ButtonModule, ChartjsModule, GridModule, RouterTestingModule],
      providers: [IconSetService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(WidgetsDropdownVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
