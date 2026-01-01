import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss'
})
export class AddVehicleComponent {

  addVehicleForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  private apiUrl = `${environment.apiUrl}/Manager/vehicleadd`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.addVehicleForm = this.fb.group({
      vehicleName: ['', Validators.required],
      model: ['', Validators.required],
      yearOfProduction: [
        '',
        [Validators.required, Validators.min(1900)]
      ],
      basePrice: [
        '',
        [Validators.required, Validators.min(0)]
      ],
      stockCount: [
        '',
        [Validators.required, Validators.min(0)]
      ],
      shortDescription: ['', Validators.required],

      specification: this.fb.group({
        engine: ['', Validators.required],
        powerOfVehical: ['', Validators.required],
        torque: ['', Validators.required],
        fuelType: ['', Validators.required],
        mileage: ['', Validators.required],
        bodyType: ['', Validators.required],
        seatingCapacity: [
          '',
          [Validators.required, Validators.min(1)]
        ]
      })
    });
  }

  submit(): void {
    if (this.addVehicleForm.invalid) {
      this.addVehicleForm.markAllAsTouched();
      return;
    }
    console.log("The service called");

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = this.addVehicleForm.value;

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = `Vehicle created successfully (ID: ${res.vehicleId})`;
        this.addVehicleForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage =
          err?.error?.message || 'Failed to create vehicle';
      }
    });
  }
}
