import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardModule, DateRangePickerModule, DropdownService, GridModule } from '@coreui/angular-pro';
import { DateRangePickerComponent } from './date-range-picker.component';
import { provideRouter } from '@angular/router';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModule, GridModule, DateRangePickerModule, DateRangePickerComponent],
      providers: [provideRouter([]), DropdownService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
