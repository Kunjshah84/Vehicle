import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { ManagerService } from '../../../../core/services/api/manager.service';
import { ManagerVehicle } from '../../../../shared/models/Manager/manager-vehicle.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-vehicles',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './show-vehicles.component.html',
  styleUrl: './show-vehicles.component.scss'
})
export class ShowVehiclesComponent implements OnInit {

  vehicles: ManagerVehicle[] = [];
  allVehicles: ManagerVehicle[] = [];

  searchText: string = '';

  constructor(
    private managerService: ManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.managerService.getMyShowroomVehicles().subscribe({
      next: (res) => {
        this.allVehicles = res;
        this.vehicles = res;
      },
      error: (err) => {
        console.error('Failed to load vehicles', err);
      }
    });
  }

  onSearch(): void {
    const query = this.searchText.trim().toLowerCase();

    if (!query) {
      // If search box empty → show all vehicles
      this.vehicles = this.allVehicles;
      return;
    }

    this.vehicles = this.allVehicles.filter(v =>
      v.vehicleName.toLowerCase().startsWith(query)
    );
  }

  onDelete(vehicleId: number): void {
    const confirmed = confirm(
      `Are you sure you want to delete vehicle ID ${vehicleId}?`
    );

    if (!confirmed) return;

    this.managerService.deleteVehicle(vehicleId).subscribe({
      next: () => {
        this.allVehicles = this.allVehicles.filter(
          v => v.vehicalId !== vehicleId
        );
        this.vehicles = this.vehicles.filter(
          v => v.vehicalId !== vehicleId
        );
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete vehicle');
      }
    });
  }

  onEdit(vehicleId: number): void {
    this.router.navigate([
      '/vehicle-management/show-vehicles',
      vehicleId,
      'edit'
    ]);
  }

  goToAddVehicle(): void {
    this.router.navigate(['/vehicle-management/add-vehicle']);
  }
}
