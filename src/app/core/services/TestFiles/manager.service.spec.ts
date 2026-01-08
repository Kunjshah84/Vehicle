import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';

import { ManagerVehicle } from '../../../shared/models/Manager/manager-vehicle.model';
import { UpdateVehicleWithSpec } from '../../../shared/models/Manager/update-vehicle-with-spec.model';
import { UpdateVehicleResponse } from '../../../shared/models/Manager/update-vehicle-response.model';
import { SaveImageVehicleResponse } from '../../../shared/models/Manager/saveVehicleImagesResponceDto';
import { AddVehicleImageResponse } from '../../../shared/models/Manager/add-vehicle-image-response.model';
import { ManagerService } from '../api/manager.service';

describe('ManagerService', () => {
  let service: ManagerService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/Manager`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ManagerService]
    });

    service = TestBed.inject(ManagerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get showroom vehicles', () => {
    const mockResponse: ManagerVehicle[] = [
      {
        vehicalId: 1,
        vehicleName: 'Car A',
        ageInShowroom: '2024-01-01',
        stockCount: 5,
        primaryImageUrl: null
      }
    ];

    service.getMyShowroomVehicles().subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/vehicles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create vehicle with specification', () => {
    const payload = {
      vehicleName: 'Car B'
    };

    service.createVehicleWithSpec(payload).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/vehicleadd`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ success: true });
  });

  it('should delete vehicle by id', () => {
    const vehicleId = 3;

    service.deleteVehicle(vehicleId).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/dltvehicle/${vehicleId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Deleted successfully' });
  });

  it('should update vehicle with spec', () => {
    const vehicleId = 4;

    const payload: UpdateVehicleWithSpec = {
      vehicleName: 'Updated Car',
      model: 'X1',
      yearOfProduction: 2024,
      basePrice: 1200000,
      stockCount: 3,
      shortDescription: 'Updated description',
      engine: 2000,
      powerOfVehical: '190hp',
      torque: '400Nm',
      fuelType: 'Petrol',
      mileage: '15kmpl',
      bodyType: 'SUV',
      seatingCapacity: 5
    };

    const mockResponse: UpdateVehicleResponse = {
      message: 'Vehicle updated successfully'
    };

    service.updateVehicle(vehicleId, payload).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.message).toContain('updated');
    });

    const req = httpMock.expectOne(`${baseUrl}/editvehicle/${vehicleId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should save vehicle images', () => {
    const vehicleId = 5;
    const images = ['img1.jpg', 'img2.jpg'];

    const mockResponse: SaveImageVehicleResponse = {
      message: 'Images saved successfully'
    };

    service.saveVehicleImages(vehicleId, images).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/vehicles/${vehicleId}/images`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ images });
    req.flush(mockResponse);
  });

  it('should delete a vehicle image', () => {
    const imageId = 10;

    service.deleteVehicleImage(imageId).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/vehicles/images/${imageId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Image deleted' });
  });

  it('should get vehicle images', () => {
    const vehicleId = 6;

    const mockResponse: AddVehicleImageResponse = {
      message: 'Images fetched',
      images: [
        {
          imageId: 1,
          vehicleId: 6,
          imageLocation: 'path/img1.jpg',
          sortOrder: 1
        }
      ]
    };

    service.getVehicleImages(vehicleId).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.images.length).toBe(1);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/vehicles/getImg/${vehicleId}/images`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
