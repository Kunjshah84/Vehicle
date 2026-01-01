import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideConfirmationComponent } from './ride-confirmation.component';
import { BookingService } from '../../../core/services/api/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RideConfirmationComponent', () => {
  let component: RideConfirmationComponent;
  let fixture: ComponentFixture<RideConfirmationComponent>;
  let bookingServiceSpy: jasmine.SpyObj<BookingService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockBooking = {
    rideStatus: 'Confirmed',
    startDate: '2025-01-01',
    endDate: '2025-01-03',
    user: {
      fullName: "any",
    email: "any",
    number: "any"
    },
    vehicle: {
      vehicleId: 1,
      vehicleName: "any",
      model: "any",
      shortDescription: "any"
    },
    showroom:{
      showroomId: 1,
      showroomName: "any",
      showroomLocation: "any",
      contactNumber: "any",
      managerNumber: "any"
    }
  };

  beforeEach(async () => {
    bookingServiceSpy = jasmine.createSpyObj('BookingService', ['bookRide']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RideConfirmationComponent],
      providers: [
        { provide: BookingService, useValue: bookingServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '5'
              }
            }
          }
        },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RideConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call bookRide with vehicleId from route', () => {
    bookingServiceSpy.bookRide.and.returnValue(of(mockBooking));
    expect(bookingServiceSpy.bookRide).toHaveBeenCalledWith(5);
  });

  it('should set booking and stop loading on success', () => {
    bookingServiceSpy.bookRide.and.returnValue(of(mockBooking));
    expect(component.booking).toEqual(mockBooking);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should set error message on API failure', () => {
    bookingServiceSpy.bookRide.and.returnValue(
      throwError(() => new Error('API failed'))
    );
    expect(component.error).toBe('Failed to book ride');
    expect(component.isLoading).toBeFalse();
  });

  it('should navigate back to vehicles on goBack()', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/vehicles']);
  });
});
