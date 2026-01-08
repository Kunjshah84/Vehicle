import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  DragDropModule,
  moveItemInArray,
  CdkDragDrop
} from '@angular/cdk/drag-drop';
import { ManagerService } from '../../../../core/services/api/manager.service';

export function noFutureDate(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) return null;

  const [y, m, d] = control.value.split('-').map(Number);
  const selected = new Date(y, m - 1, d);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected > today ? { futureDate: true } : null;
}

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss'
})
export class AddVehicleComponent {

  router = inject(Router);
  today = new Date().toISOString().split('T')[0];

  addVehicleForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  images: {
    imageId: number;
    vehicleId: number;
    imageLocation: string;
    sortOrder: number;
  }[] = [];

  selectedFiles: File[] = [];
  isUploading = false;

  private cloudName = 'dzpb70mwo';
  private uploadPreset = 'manager_vehicle_images_unsigned';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private managerService: ManagerService
  ) {
    this.addVehicleForm = this.fb.group({
      vehicleName: ['', [Validators.required, Validators.minLength(2)]],
      model: ['', Validators.required],

      yearOfProduction: [
        '',
        [
          Validators.required,
          Validators.min(1886),
          Validators.max(new Date().getFullYear())
        ]
      ],

      ageInShowroom: ['', [Validators.required, noFutureDate]],

      basePrice: [null, [Validators.required, Validators.min(1)]],
      stockCount: [0, [Validators.required, Validators.min(0)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(200)]],

      specification: this.fb.group({
        engine: [null, [Validators.required, Validators.min(1)]],
        powerOfVehical: [null, [Validators.required, Validators.min(1)]],
        torque: [null, [Validators.required, Validators.min(1)]],
        fuelType: ['', Validators.required],
        mileage: [null, [Validators.required, Validators.min(1)]],
        bodyType: ['', Validators.required],
        seatingCapacity: [null, [Validators.required, Validators.min(1)]]
      })
    });
  }

  isInvalid(path: string): boolean {
    const control = this.addVehicleForm.get(path);
    return !!(control && control.invalid && control.touched);
  }

  get isFormInvalid(): boolean {
    return this.addVehicleForm.invalid;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    this.selectedFiles = Array.from(input.files).filter(f =>
      allowed.includes(f.type)
    );

    input.value = '';
  }

  uploadImages(): void {
    this.isUploading = true;

    this.selectedFiles.forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);

      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

      this.http.post<any>(url, formData).subscribe(res => {
        this.images.push({
          imageId: 0,
          vehicleId: 0,
          imageLocation: res.secure_url,
          sortOrder: this.images.length + 1
        });
        this.isUploading = false;
        this.selectedFiles = [];
      });
    });
  }

  onDrop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
    this.images.forEach((img, i) => (img.sortOrder = i + 1));
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
    this.images.forEach((img, i) => (img.sortOrder = i + 1));
  }

  finalSave(): void {
    if (this.addVehicleForm.invalid) {
      this.addVehicleForm.markAllAsTouched();
      return;
    }

    const rawValue = this.addVehicleForm.value;

  const payload = {
    ...rawValue,
    ageInShowroom: rawValue.ageInShowroom ? new Date(rawValue.ageInShowroom).toISOString().split('T')[0] : '',
    
    specification: {
      ...rawValue.specification,
      powerOfVehical: rawValue.specification.powerOfVehical?.toString(),
      torque: rawValue.specification.torque?.toString(),
      mileage: rawValue.specification.mileage?.toString(),
      fuelType: rawValue.specification.fuelType?.toString(),
      bodyType: rawValue.specification.bodyType?.toString(),
      
      engine: rawValue.specification.engine,
      seatingCapacity: rawValue.specification.seatingCapacity
    }
  };
   console.log(payload);

    this.managerService
      .createVehicleWithSpec(payload)
      .subscribe(res => {
        const vehicleId = res.vehicleId;

        if (!this.images.length) {
          this.router.navigate(['/vehicle-management/show-vehicles']);
          return;
        }

        this.managerService
          .saveVehicleImages(vehicleId, this.images)
          .subscribe(() =>
            this.router.navigate(['/vehicle-management/show-vehicles'])
          );
      });
  }

  goBackToShowVehicles(): void {
    this.router.navigate(['/vehicle-management/show-vehicles']);
  }
}
