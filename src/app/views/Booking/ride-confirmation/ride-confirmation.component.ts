import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { RideBookingService } from '../../../core/services/api/ride-booking.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-ride',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './ride-confirmation.component.html',
  styleUrls: ['./ride-confirmation.component.scss'],
})
export class BookRideComponent implements OnInit {

  vehicleId = 0;

  noSlotsAvailable = false;

  canBook = false;
  bookingInfo: any = null;

  selectedDate: Date | null = null;
  availableSlots: number[] = [];
  selectedSlot: number | null = null;

  loading = false;
  error: string | null = null;

  bookingStatus: 'IDLE' | 'PENDING' = 'IDLE';

  constructor(
    private rideBookingService: RideBookingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    this.checkCanBook();
  }

  checkCanBook() {
    this.rideBookingService.canBook(this.vehicleId).subscribe({
      next: res => {
        this.canBook = res.canBook;
        this.bookingInfo = res.canBook ? null : res;
        this.error = null;
      },  
      error: err => {
        this.error = err.error?.message || 'Failed to check booking status';
      }
    });
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getDay() !== 0 && date >= today;
  };

  onDateChange(date: Date | null) {
  this.selectedSlot = null;
  this.availableSlots = [];
  this.noSlotsAvailable = false;

  if (!date) return;

  this.selectedDate = date;

  const formattedDate = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');

  this.loading = true;

  this.rideBookingService
    .getAvailableSlots(this.vehicleId, formattedDate)
    .subscribe({
      next: slots => {
        this.availableSlots = slots;
        this.noSlotsAvailable = slots.length === 0;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load available slots';
        this.loading = false;
      }
    });
}

  bookRide() {
    if (!this.selectedDate || this.selectedSlot === null) return;

    const bookingDate = [
      this.selectedDate.getFullYear(),
      String(this.selectedDate.getMonth() + 1).padStart(2, '0'),
      String(this.selectedDate.getDate()).padStart(2, '0')
    ].join('-');

    const payload = {
      vehicleId: this.vehicleId,
      bookingDate: bookingDate,
      slotHour: this.selectedSlot
    };

    this.loading = true;

    this.rideBookingService.createBooking(payload).subscribe({
      next: () => {
        this.bookingStatus = 'PENDING';
        this.loading = false;
        this.checkCanBook();
      },
      error: err => {
        this.error = err.error?.message || 'Booking failed';
        this.loading = false;
      }
    });
  }


  formatSlot(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  formatDate(date: string): string {
    return new Date(date).toDateString();
  }
}
