import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { ManagerService } from '../../../../core/services/api/manager.service';
import { ManagerVehicle } from '../../../../shared/models/Manager/manager-vehicle.model';

@Component({
  selector: 'app-show-vehicles',
  standalone: true,
  imports: [NgFor],
  templateUrl: './show-vehicles.component.html',
  styleUrl: './show-vehicles.component.scss'
})
export class ShowVehiclesComponent implements OnInit {

  vehicles: ManagerVehicle[] = [];

  constructor(
    private managerService: ManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.managerService.getMyShowroomVehicles().subscribe({
      next: (res) => {
        this.vehicles = res;
      },
      error: (err) => {
        console.error('Failed to load vehicles', err);
      }
    });
  }

  onDelete(vehicleId: number): void {
    const confirmed = confirm(
      `Are you sure you want to delete vehicle ID ${vehicleId}?`
    );

    if (!confirmed) {
      return;
    }

    this.managerService.deleteVehicle(vehicleId).subscribe({
      next: () => {
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
}
