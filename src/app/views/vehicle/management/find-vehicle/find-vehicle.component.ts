import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleSpecService } from '../../../../core/services/api/vehicle-spec.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-find-vehicle',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf , NgbCarouselModule , NgFor ],
  templateUrl: './find-vehicle.component.html',
  styleUrls: ['./find-vehicle.component.scss']
})
export class FindVehicleComponent {

  isLoading = false;
  vehicle: any = null;
  error: string | null = null;

  form = new FormGroup({
    vehicleId: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ])
  });

  constructor(private vehicleSpecService: VehicleSpecService) {}

  findVehicle(): void {
    if (this.form.invalid) {
      return;
    }

    const id = this.form.value.vehicleId!;
    this.isLoading = true;
    this.vehicle = null;
    this.error = null;

    this.vehicleSpecService.getVehicleDetails(id).subscribe({
      next: (res) => {
        this.vehicle = res;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Vehicle not found';
        this.isLoading = false;
      }
    });
  }
}
