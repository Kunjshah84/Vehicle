import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehicleSpecService } from '../../../../core/services/api/vehicle-spec.service';
import { VehicleDetails } from '../../../../shared/models/vehicle-details.model';
import { Router } from '@angular/router';
import { ManagerService } from '../../../../core/services/api/manager.service';
import { UpdateVehicleWithSpec } from '../../../../shared/models/Manager/update-vehicle-with-spec.model';


@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss'
})
export class EditVehicleComponent implements OnInit {

  vehicleForm!: FormGroup;
  vehicleId!: number;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private vehicleSpecService: VehicleSpecService,
    private router: Router,
    private managerService: ManagerService

  ) {}

  ngOnInit(): void {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    this.vehicleForm = this.fb.group({
      vehicleName: [''],
      model: [''],
      yearOfProduction: [''],
      basePrice: [''],
      shortDescription: [''],
      stockCount: [''],
      engine: [''],
      powerOfVehical: [''],
      torque: [''],
      fuelType: [''],
      mileage: [''],
      bodyType: [''],
      seatingCapacity: ['']
    });
    this.loadVehicleDetails();
  }

  private loadVehicleDetails(): void {
    this.vehicleSpecService.getVehicleDetails(this.vehicleId).subscribe({
      next: (data: VehicleDetails) => {

        const spec = data.specifications?.[0];

        this.vehicleForm.patchValue({
          vehicleName: data.vehicleName,
          model: data.model,
          yearOfProduction: data.yearOfProduction,
          basePrice: data.basePrice,
          stockCount: data.stockCount,
          shortDescription: data.shortDescription,

          engine: spec?.engine ?? '',
          powerOfVehical: spec?.powerOfvehical ?? '',
          torque: spec?.torque ?? '',
          fuelType: spec?.fuleType ?? '',
          mileage: spec?.mileage ?? '',
          bodyType: spec?.bodyType ?? '',
          seatingCapacity: spec?.seatingCapacity ?? ''
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load vehicle details', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      return;
    }

    const payload: UpdateVehicleWithSpec = this.vehicleForm.value;

    this.managerService.updateVehicle(this.vehicleId, payload).subscribe({
      next: () => {
        alert(`Vehicle updated successfully`);
        this.router.navigate(['/vehicle-management/show-vehicles']);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Failed to update vehicle');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/vehicle-management/show-vehicles']);
  }
}
