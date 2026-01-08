import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { VehicleDetails } from '../../../shared/models/vehicle-details.model';
import { VehicleSpecService } from '../api/vehicle-spec.service';

describe('VehicleSpecService', () => {
  let service: VehicleSpecService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/Vehicles`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VehicleSpecService]
    });

    service = TestBed.inject(VehicleSpecService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch vehicle details by id', () => {
    const vehicleId = 1;

    const mockResponse: VehicleDetails = {
      vehicalId: 1,
      vehicleName: 'Test Car',
      model: 'ZX',
      yearOfProduction: 2023,
      ageInShowroom: '2024-01-01',
      basePrice: 1000000,
      stockCount: 2,
      shortDescription: 'Test description',
      images: [
        {
          imageLocation: 'img/car1.jpg',
          sortOrder: 1
        }
      ],
      specifications: [
        {
          engine: 1500,
          powerOfvehical: '120hp',
          torque: '250Nm',
          fuleType: 'Petrol',
          mileage: '18kmpl',
          bodyType: 'Sedan',
          seatingCapacity: 5
        }
      ]
    };

    service.getVehicleDetails(vehicleId).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.vehicalId).toBe(vehicleId);
      expect(res.images.length).toBe(1);
      expect(res.specifications.length).toBe(1);
    });

    const req = httpMock.expectOne(
      `${baseUrl}/details/${vehicleId}`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
