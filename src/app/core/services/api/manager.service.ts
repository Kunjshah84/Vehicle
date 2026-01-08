import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ManagerVehicle } from '../../../shared/models/Manager/manager-vehicle.model';
import { CreateVehicle } from '../../../shared/models/Manager/create-vehicle.model';
import { CreateVehicleSpecification } from '../../../shared/models/Manager/create-vehicle-spec.model';
import { UpdateVehicleWithSpec } from '../../../shared/models/Manager/update-vehicle-with-spec.model';
import { AddVehicleImageResponse } from '../../../shared/models/Manager/add-vehicle-image-response.model';
import { UpdateVehicleResponse } from '../../../shared/models/Manager/update-vehicle-response.model';
import { SaveImageVehicleResponse } from '../../../shared/models/Manager/saveVehicleImagesResponceDto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private baseUrl = `${environment.apiUrl}/Manager`;

  constructor(private http: HttpClient) {}

  getMyShowroomVehicles(): Observable<ManagerVehicle[]> {
    return this.http.get<ManagerVehicle[]>(`${this.baseUrl}/vehicles`);
  }

  createVehicleWithSpec(payload: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/vehicleadd`, payload);
}

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/dltvehicle/${vehicleId}`
    );
  }

  updateVehicle(vehicleId: number,payload: UpdateVehicleWithSpec): Observable<UpdateVehicleResponse> {
    return this.http.put<UpdateVehicleResponse>(
      `${this.baseUrl}/editvehicle/${vehicleId}`,
      payload
    );
  }
  
  saveVehicleImages(vehicleId: number, images: any[]):Observable<SaveImageVehicleResponse> {
    return this.http.post<SaveImageVehicleResponse>(
      `${this.baseUrl}/vehicles/${vehicleId}/images`,
      {
        images: images
      }
    );
  }



  deleteVehicleImage(imageId: number) {
    return this.http.delete(
      `${this.baseUrl}/vehicles/images/${imageId}`
    );
  }

  getVehicleImages(vehicleId: number) {
    return this.http.get<AddVehicleImageResponse>(
      `${this.baseUrl}/vehicles/getImg/${vehicleId}/images`
    );
  }
}
