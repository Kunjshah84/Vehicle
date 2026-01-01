import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Vehicle } from '../../../shared/models/vehicle.model';


@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private readonly API = environment.apiUrl + '/vehicles';

  getDashboardVehicles(filters?: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    fuelTypes?: string;
    bodyTypes?: string;
    minEngine?: number;
    maxEngine?: number;
    sortBy?: string;
  }): Observable<Vehicle[]> {

    const params: any = {};

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          params[key] = value;
        }
      });
    }

    return this.http.get<Vehicle[]>(`${this.API}/dashboard`, { params });
  }
}
