import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RideBookingService } from '../../../../core/services/api/ride-booking.service';
import { PendingBookingDto } from '../../../../shared/models/booking/PendingBookingDto';

@Component({
  selector: 'app-pending-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-requests.component.html',
  styleUrl: './pending-requests.component.scss'
})
export class PendingRequestsComponent implements OnInit {
  bookings: PendingBookingDto[] = [];
  loading = true;

  constructor(private bookingService: RideBookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getPendingBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching bookings', err);
        this.loading = false;
      }
    });
  }

  onAccept(id: number) {
    if (confirm('Are you sure you want to accept this booking?')) {
      this.bookingService.acceptBooking(id).subscribe({
        next: (response) => {
          alert(response.message);
          this.removeBookingFromList(id);
        },
        error: (err) => {
          console.error('Error accepting booking', err);
          alert('Failed to accept booking: ' + (err.error?.message || 'Server Error'));
        }
      });
    }
  }

  onReject(id: number) {
    if (confirm('Are you sure you want to reject this booking?')) {
      this.bookingService.rejectBooking(id).subscribe({
        next: (response) => {
          alert(response.message);
          this.removeBookingFromList(id);
        },
        error: (err) => {
          console.error('Error rejecting booking', err);
          alert('Failed to reject booking: ' + (err.error?.message || 'Server Error'));
        }
      });
    }
  }

  private removeBookingFromList(id: number) {
    this.bookings = this.bookings.filter(b => b.bookingId !== id);
  }

  formatSlot(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  }
}
