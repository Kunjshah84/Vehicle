import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ManagerVehicle } from '../../../shared/models/Manager/manager-vehicle.model';
import { CreateVehicle } from '../../../shared/models/Manager/create-vehicle.model';
import { CreateVehicleSpecification } from '../../../shared/models/Manager/create-vehicle-spec.model';
import { UpdateVehicleWithSpec } from '../../../shared/models/Manager/update-vehicle-with-spec.model';
import { CreateVehicleImage } from '../../../shared/models/Manager/create-vehicle-image.model';
import { VehicleImageSe } from '../../../shared/models/Manager/vehicle-image.model';
import { AddVehicleImageResponse } from '../../../shared/models/Manager/add-vehicle-image-response.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private baseUrl = `${environment.apiUrl}/Manager`;

  constructor(private http: HttpClient) {}

  getMyShowroomVehicles(): Observable<ManagerVehicle[]> {
    return this.http.get<ManagerVehicle[]>(`${this.baseUrl}/vehicles`);
  }

  createVehicleWithSpec(
    vehicle: CreateVehicle,
    spec: CreateVehicleSpecification
  ): Observable<any> {

    return this.http.post<any>(`${this.baseUrl}/vehicleadd`, vehicle);
  }

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/dltvehicle/${vehicleId}`
    );
  }

  updateVehicle(vehicleId: number,payload: UpdateVehicleWithSpec): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/editvehicle/${vehicleId}`,
      payload
    );
  }

  addVehicleImage(
    vehicleId: number,
    payload: CreateVehicleImage
  ): Observable<AddVehicleImageResponse> {
    return this.http.post<AddVehicleImageResponse>(
      `${this.baseUrl}/vehicles/${vehicleId}/images`,
      payload
    );
  }

  deleteVehicleImage(imageId: number) {
    return this.http.delete(
      `${this.baseUrl}/vehicles/images/${imageId}`
    );
  }
}
