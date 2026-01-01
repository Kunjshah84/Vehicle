import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManagerService } from '../../../../core/services/api/manager.service';
import { VehicleImageSe } from '../../../../shared/models/Manager/vehicle-image.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddVehicleImageResponse } from '../../../../shared/models/Manager/add-vehicle-image-response.model';

@Component({
  selector: 'app-add-vehicle-image',
  templateUrl: './add-vehicle-image.component.html',
  imports: [NgIf, NgFor, FormsModule],
  styleUrl: './add-vehicle-image.component.scss'
})
export class AddVehicleImageComponent {

  vehicleId: number | null = null;
  selectedFile: File | null = null;

  images: VehicleImageSe[] = [];

  isUploading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private cloudName = 'dzpb70mwo';
  private uploadPreset = 'manager_vehicle_images_unsigned';

  constructor(
    private http: HttpClient,
    private managerService: ManagerService
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = null;
      this.successMessage = null;
    }
  }

  uploadImage() {
    if (!this.selectedFile || !this.vehicleId) return;

    this.isUploading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', this.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    this.http.post<any>(url, formData).subscribe({
      next: res => {
        const imageUrl = res.secure_url;

        this.managerService.addVehicleImage(
          this.vehicleId!,
          { imageLocation: imageUrl }
        ).subscribe({
          next: (response: AddVehicleImageResponse) => {
            this.images = response.images;
            this.successMessage = 'Image uploaded successfully';
            this.isUploading = false;
            this.selectedFile = null;
          },
          error: err => {
            this.errorMessage =
              err?.error?.message || 'Failed to save image in backend';
            this.isUploading = false;
          }
        });
      },
      error: err => {
        this.errorMessage =
          err?.error?.error?.message || 'Cloudinary upload failed';
        this.isUploading = false;
      }
    });
  }

  confirmDelete(imageId: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this image?'
    );

    if (!confirmed) return;

    this.managerService.deleteVehicleImage(imageId).subscribe({
      next: () => {
        this.images = this.images.filter(img => img.imageId !== imageId);
        this.successMessage = 'Image deleted successfully';
      },
      error: err => {
        this.errorMessage =
          err?.error?.message || 'Failed to delete image';
      }
    });
  }
}
