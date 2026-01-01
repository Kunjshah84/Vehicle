import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../../core/services/api/vehicle.service';
import { Vehicle } from '../../../shared/models/vehicle.model';


@Component({
  selector: 'app-deshboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deshboard.component.html',
  styleUrl: './deshboard.component.scss'
})
export class DeshboardComponent implements OnInit {

  private router = inject(Router);
  private vehicleService = inject(VehicleService);

  vehicles: Vehicle[] = [];
  isLoading = true;
  error: string | null = null;

  filters = {
    search: null as string | null,

    minPrice: null as number | null,
    maxPrice: null as number | null,

    fuelTypes: [] as string[],
    bodyTypes: [] as string[],

    minEngine: null as number | null,
    maxEngine: null as number | null,

    sortBy: null as string | null
  };

  fuelTypeOptions = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  bodyTypeOptions = ['SUV', 'Sedan', 'Hatchback', 'Coupe'];

  ngOnInit(): void {
    this.applyFilters(); 
  }

  onCheckboxChange(event: any, key: 'fuelTypes' | 'bodyTypes'): void {
    const value = event.target.value;

    if (event.target.checked) {
      this.filters[key].push(value);
    } else {
      this.filters[key] = this.filters[key].filter(v => v !== value);
    }
  }

  applyFilters(): void {
    this.isLoading = true;
    this.error = null;

    this.vehicleService.getDashboardVehicles({
      search: this.filters.search?.trim() || undefined,
      minPrice: this.filters.minPrice ?? undefined,
      maxPrice: this.filters.maxPrice ?? undefined,
      fuelTypes: this.filters.fuelTypes.length
        ? this.filters.fuelTypes.join(',')
        : undefined,
      bodyTypes: this.filters.bodyTypes.length
        ? this.filters.bodyTypes.join(',')
        : undefined,
      minEngine: this.filters.minEngine ?? undefined,
      maxEngine: this.filters.maxEngine ?? undefined,
      sortBy: this.filters.sortBy ?? undefined
    }).subscribe({
      next: data => {
        this.vehicles = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load vehicles';
        this.isLoading = false;
      }
    });
  }

  resetFilters(): void {
    this.filters = {
      search: null,
      minPrice: null,
      maxPrice: null,
      fuelTypes: [],
      bodyTypes: [],
      minEngine: null,
      maxEngine: null,
      sortBy: null
    };

    this.applyFilters();
  }

  goToVehicle(vehicalId: number): void {
    this.router.navigate(['/vehicalspecification', vehicalId]);
  }
}
