import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehicleSpecService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:5078/api/Vehicles';

  getVehicleDetails(id: number): Observable<any> {
    return this.http.get(`${this.API}/details/${id}`);
  }
}
