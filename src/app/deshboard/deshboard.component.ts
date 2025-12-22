import { Component, inject, OnInit } from '@angular/core';
import {Vehicle, VehicleService } from '../core/services/vehicle.service'
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';



@Component({
  selector: 'app-deshboard',
  imports: [CommonModule],
  templateUrl: './deshboard.component.html',
  styleUrl: './deshboard.component.scss'
})
export class DeshboardComponent implements OnInit{

  private router = inject(Router);

  private vehicleService = inject(VehicleService);
    vehicles: Vehicle[] = [];
      isLoading = true;
      error: string | null = null;

      ngOnInit(): void {
        this.vehicleService.getDashboardVehicles().subscribe({
          next: (data) => {
            this.vehicles = data;
            this.isLoading = false;
          },
          error: () => {
            this.error = 'Failed to load vehicles';
            this.isLoading = false;
          }
    });
  }

  //LIke for to get the id and navigate to vehicle spec page
  goToVehicle(vehicalId: number): void {
    // console.log('Navigating to vehicle with ID:', vehicalId);
    this.router.navigate(['/vehicalspecification', vehicalId]);
  }
}
