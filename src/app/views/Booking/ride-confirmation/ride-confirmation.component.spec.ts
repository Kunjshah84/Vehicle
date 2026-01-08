import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookRideComponent } from './ride-confirmation.component';
import { RideBookingService } from '../../../core/services/api/ride-booking.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('BookRideComponent', () => {
  let component: BookRideComponent;
  let fixture: ComponentFixture<BookRideComponent>;
  let rideBookingService: jasmine.SpyObj<RideBookingService>;

  beforeEach(async () => {
    const rideBookingSpy = jasmine.createSpyObj('RideBookingService', [
      'canBook',
      'getAvailableSlots',
      'createBooking'
    ]);

    await TestBed.configureTestingModule({
      imports: [BookRideComponent],
      providers: [
        { provide: RideBookingService, useValue: rideBookingSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '5'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookRideComponent);
    component = fixture.componentInstance;
    rideBookingService = TestBed.inject(
      RideBookingService
    ) as jasmine.SpyObj<RideBookingService>;

    rideBookingService.canBook.and.returnValue(of({ canBook: true }));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should read vehicleId from route params', () => {
    expect(component.vehicleId).toBe(5);
  });

  it('should allow booking when canBook API returns true', () => {
    component.checkCanBook();

    expect(rideBookingService.canBook).toHaveBeenCalledWith(5);
    expect(component.canBook).toBeTrue();
    expect(component.error).toBeNull();
  });

  it('should handle error when canBook API fails', () => {
    rideBookingService.canBook.and.returnValue(
      throwError(() => ({ error: { message: 'Error occurred' } }))
    );

    component.checkCanBook();

    expect(component.error).toBe('Error occurred');
  });

  it('should load available slots on date change', () => {
    const testDate = new Date('2026-01-10');
    rideBookingService.getAvailableSlots.and.returnValue(of([9, 10, 11]));

    component.onDateChange(testDate);

    expect(rideBookingService.getAvailableSlots).toHaveBeenCalled();
    expect(component.availableSlots.length).toBe(3);
    expect(component.noSlotsAvailable).toBeFalse();
  });

  it('should create booking and set status to PENDING', () => {
    component.selectedDate = new Date('2026-01-10');
    component.selectedSlot = 10;

    rideBookingService.createBooking.and.returnValue(of({}));

    component.bookRide();

    expect(rideBookingService.createBooking).toHaveBeenCalled();
    expect(component.bookingStatus).toBe('PENDING');
  });
});
