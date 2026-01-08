import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingRequestsComponent } from './pending-requests.component';
import { RideBookingService } from '../../../../core/services/api/ride-booking.service';
import { of, throwError } from 'rxjs';

describe('PendingRequestsComponent', () => {
  let component: PendingRequestsComponent;
  let fixture: ComponentFixture<PendingRequestsComponent>;
  let bookingService: jasmine.SpyObj<RideBookingService>;

  beforeEach(async () => {
    const bookingSpy = jasmine.createSpyObj('RideBookingService', [
      'getPendingBookings',
      'acceptBooking',
      'rejectBooking'
    ]);

    await TestBed.configureTestingModule({
      imports: [PendingRequestsComponent],
      providers: [
        { provide: RideBookingService, useValue: bookingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PendingRequestsComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(
      RideBookingService
    ) as jasmine.SpyObj<RideBookingService>;

    bookingService.getPendingBookings.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load pending bookings on init', () => {
    const mockBookings = [
      { bookingId: 1, slotHour: 10 },
      { bookingId: 2, slotHour: 12 }
    ] as any;

    bookingService.getPendingBookings.and.returnValue(of(mockBookings));

    component.loadBookings();

    expect(bookingService.getPendingBookings).toHaveBeenCalled();
    expect(component.bookings.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should accept booking and remove it from list', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    component.bookings = [
      { bookingId: 1 } as any,
      { bookingId: 2 } as any
    ];

    bookingService.acceptBooking.and.returnValue(
      of({ message: 'Accepted successfully' })
    );

    component.onAccept(1);

    expect(bookingService.acceptBooking).toHaveBeenCalledWith(1);
    expect(component.bookings.length).toBe(1);
    expect(component.bookings[0].bookingId).toBe(2);
  });

  it('should reject booking and remove it from list', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    component.bookings = [
      { bookingId: 1 } as any,
      { bookingId: 2 } as any
    ];

    bookingService.rejectBooking.and.returnValue(
      of({ message: 'Rejected successfully' })
    );

    component.onReject(2);

    expect(bookingService.rejectBooking).toHaveBeenCalledWith(2);
    expect(component.bookings.length).toBe(1);
    expect(component.bookings[0].bookingId).toBe(1);
  });

  it('should format slot hour correctly', () => {
    expect(component.formatSlot(0)).toBe('12:00 AM');
    expect(component.formatSlot(12)).toBe('12:00 PM');
    expect(component.formatSlot(15)).toBe('3:00 PM');
  });
});
