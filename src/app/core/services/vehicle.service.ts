import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
  vehicalId: number;
  vehicleName: string;
  model: string;
  yearOfProduction: number;
  basePrice: number;
  stockCount: number;
  shortDescription: string;
  images: {
    imageLocation: string;
    sortOrder: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:5078/api/vehicles'; // adjust if needed

  getDashboardVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.API);
  }
}
