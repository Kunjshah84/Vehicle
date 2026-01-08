import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBookingsComponent } from './user-bookings.component';
import { RideBookingService } from '../../../core/services/api/ride-booking.service';
import { of, throwError } from 'rxjs';
import { UserBooking } from '../../../shared/models/booking/user-booking.model';

describe('UserBookingsComponent', () => {
  let component: UserBookingsComponent;
  let fixture: ComponentFixture<UserBookingsComponent>;
  let bookingServiceSpy: jasmine.SpyObj<RideBookingService>;

  beforeEach(async () => {
    bookingServiceSpy = jasmine.createSpyObj('RideBookingService', [
      'getMyUpcomingBookings'
    ]);

    await TestBed.configureTestingModule({
      imports: [UserBookingsComponent],
      providers: [
        { provide: RideBookingService, useValue: bookingServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserBookingsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    bookingServiceSpy.getMyUpcomingBookings.and.returnValue(of([]));
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load user bookings on init', () => {
    const mockBookings: UserBooking[] = [
      {
        bookingId: 1,
        vehicleId: 10,
        vehicleName: 'Car A',
        vehiclePrimaryImage: null,
        bookingDate: '2024-01-01',
        slotHour: 10,
        status: 'Confirmed',
        bookingCreatedAt: '2023-12-20'
      }
    ];

    bookingServiceSpy.getMyUpcomingBookings.and.returnValue(
      of(mockBookings)
    );

    fixture.detectChanges(); // triggers ngOnInit

    expect(bookingServiceSpy.getMyUpcomingBookings)
      .toHaveBeenCalled();

    expect(component.bookings)
      .toEqual(mockBookings);

    expect(component.loading)
      .toBeFalse();
  });


  it('should stop loading when booking fetch fails', () => {
    bookingServiceSpy.getMyUpcomingBookings.and.returnValue(
      throwError(() => new Error('API Error'))
    );

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.bookings.length)
      .toBe(0);

    expect(component.loading)
      .toBeFalse();
  });
});
