import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from '../../../shared/models/booking/booking.model';
import { BookingService } from '../../../core/services/api/booking.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-ride-confirmation',
  imports: [NgIf ],
  templateUrl: './ride-confirmation.component.html',
  styleUrls: ['./ride-confirmation.component.scss'],
})
export class RideConfirmationComponent implements OnInit {

  booking!: Booking;
  isLoading = true;
  error: string | null = null;
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    const vehicleId = Number(this.route.snapshot.paramMap.get('id'));

    this.bookingService.bookRide(vehicleId).subscribe({
      next: (res: Booking) => {
        this.booking = res;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to book ride';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {  
    this.router.navigate(['/vehicles']); 
    // window.history.back();
  }
}
