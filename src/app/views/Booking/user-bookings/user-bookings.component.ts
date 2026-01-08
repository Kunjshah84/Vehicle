import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RideBookingService } from '../../../core/services/api/ride-booking.service';
import { UserBooking } from '../../../shared/models/booking/user-booking.model';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.scss'
})
export class UserBookingsComponent implements OnInit {

  private bookingService = inject(RideBookingService);

  bookings: UserBooking[] = [];
  loading = true;

  ngOnInit(): void {
    this.bookingService.getMyUpcomingBookings().subscribe({
      next: (res) => {
        this.bookings = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
