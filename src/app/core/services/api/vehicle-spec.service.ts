import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VehicleDetails } from '../../../shared/models/vehicle-details.model';

@Injectable({ providedIn: 'root' })
export class VehicleSpecService {
  private http = inject(HttpClient);
  private readonly API = environment.apiUrl + '/Vehicles';

  getVehicleDetails(id: number): Observable<VehicleDetails> {
    return this.http.get<VehicleDetails>(`${this.API}/details/${id}`);
  }
}
