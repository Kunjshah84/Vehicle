import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { VehicleSpecService } from '../core/services/vehicle-spec.service';

@Component({
  selector: 'app-vehicalspec',
  standalone: true,
  imports: [NgIf, NgFor, NgbCarouselModule, CommonModule],
  templateUrl: './vehicalspec.component.html',
  styleUrl: './vehicalspec.component.scss'
})
export class VehicalspecComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleSpecService = inject(VehicleSpecService);

  vehicle: any = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.vehicleSpecService.getVehicleDetails(id).subscribe({
        next: (data) => {
          this.vehicle = data;
          this.isLoading = false;
        },
        error: (err) => {
          // console.error(err);
          this.error = 'Failed to load vehicle data.';
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    // Navigates back to the main showroom/listing
    this.router.navigate(['/vehicles']); 
  }
}