import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehicleSpecService } from '../../../../core/services/api/vehicle-spec.service';
import { ManagerService } from '../../../../core/services/api/manager.service';
import { UpdateVehicleWithSpec } from '../../../../shared/models/Manager/update-vehicle-with-spec.model';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { VehicleImageSe } from '../../../../shared/models/Manager/vehicle-image.model';
import { AddVehicleImageResponse } from '../../../../shared/models/Manager/add-vehicle-image-response.model';
import { HttpClient } from '@angular/common/http';

export function noFutureDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selectedDate = new Date(control.value);
  selectedDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate > today ? { futureDate: true } : null;
}

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss'
})
export class EditVehicleComponent implements OnInit {
  vehicleForm!: FormGroup;
  vehicleId!: number;
  isLoading = true;
  images: VehicleImageSe[] = [];
  selectedFiles: File[] = [];
  isUploading = false;
  imageError: string | null = null;
  successMessage: string | null = null;
  
  todayDate: string = new Date().toISOString().split('T')[0];

  private cloudName = 'dzpb70mwo';
  private uploadPreset = 'manager_vehicle_images_unsigned';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private vehicleSpecService: VehicleSpecService,
    private managerService: ManagerService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));

    this.vehicleForm = this.fb.group({
      vehicleName: ['', [Validators.required, Validators.minLength(2)]],
      model: ['', Validators.required],
      yearOfProduction: ['', [Validators.required, Validators.min(1886), Validators.max(new Date().getFullYear())]],
      ageInShowroom: ['', [Validators.required, noFutureDate]],
      basePrice: [null, [Validators.required, Validators.min(1)]],
      stockCount: [0, [Validators.required, Validators.min(0)]],
      shortDescription: ['', [Validators.required, Validators.maxLength(200)]],
      engine: [null, [Validators.required, Validators.min(1)]],
      powerOfVehical: [null, [Validators.required, Validators.min(1)]],
      torque: [null, [Validators.required, Validators.min(1)]],
      fuelType: ['', Validators.required],
      mileage: [null, [Validators.required, Validators.min(1)]],
      bodyType: ['', Validators.required],
      seatingCapacity: [null, [Validators.required, Validators.min(1)]]
    });

    this.loadVehicleDetails();
    this.loadVehicleImages();
  }

  loadVehicleDetails(): void {
    this.vehicleSpecService.getVehicleDetails(this.vehicleId).subscribe({
      next: data => {
        const spec = data.specifications?.[0];
        const formattedDate = data.ageInShowroom ? data.ageInShowroom.split('T')[0] : '';
        this.vehicleForm.patchValue({
          vehicleName: data.vehicleName,
          model: data.model,
          yearOfProduction: data.yearOfProduction,
          ageInShowroom: formattedDate,
          basePrice: data.basePrice,
          stockCount: data.stockCount,
          shortDescription: data.shortDescription,
          engine: spec?.engine,
          powerOfVehical: spec?.powerOfvehical,
          torque: spec?.torque,
          fuelType: spec?.fuleType,
          mileage: spec?.mileage,
          bodyType: spec?.bodyType,
          seatingCapacity: spec?.seatingCapacity
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadVehicleImages(): void {
    this.managerService.getVehicleImages(this.vehicleId).subscribe({
      next: (res: AddVehicleImageResponse) => { this.images = res.images ?? []; },
      error: () => { this.imageError = 'Failed to load vehicle images'; this.images = []; }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.selectedFiles = Array.from(input.files);
    input.value = '';
  }

  uploadImages(): void {
    if (this.selectedFiles.length === 0) return;
    this.isUploading = true;
    let completed = 0;
    this.selectedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
      this.http.post<any>(url, formData).subscribe({
        next: res => {
          this.images.push({ imageId: 0, vehicleId: this.vehicleId, imageLocation: res.secure_url, sortOrder: this.images.length + 1 });
          completed++;
          if (completed === this.selectedFiles.length) {
            this.isUploading = false;
            this.successMessage = 'Images uploaded successfully';
            this.selectedFiles = [];
          }
        },
        error: () => { this.imageError = 'One or more uploads failed'; this.isUploading = false; }
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

  onSubmit(): void {
    if (this.vehicleForm.invalid) return;
    const payload: UpdateVehicleWithSpec = this.vehicleForm.value;
    this.managerService.updateVehicle(this.vehicleId, payload).subscribe({
      next: () => { alert('Vehicle updated'); this.router.navigate(['/vehicle-management/show-vehicles']); }
    });
  }

  goBack(): void { this.router.navigate(['/vehicle-management/show-vehicles']); }

  saveImages(): void {
    this.managerService.saveVehicleImages(this.vehicleId, this.images).subscribe({
      next: () => { alert('Images saved successfully'); this.loadVehicleImages(); },
      error: err => { alert('Failed to save images'); }
    });
  }
}