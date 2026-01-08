import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { Vehicle } from '../../../shared/models/vehicle.model';
import { VehicleService } from '../api/vehicle.service';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;

  const API = environment.apiUrl + '/vehicles';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VehicleService]
    });

    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call dashboard API without filters', () => {
    const mockVehicles: Vehicle[] = [];

    service.getDashboardVehicles().subscribe(res => {
      expect(res).toEqual(mockVehicles);
    });

    const req = httpMock.expectOne(`${API}/dashboard`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);

    req.flush(mockVehicles);
  });

  it('should call dashboard API with filters as query params', () => {
    const mockVehicles: Vehicle[] = [];

    const filters = {
      search: 'SUV',
      minPrice: 500000,
      maxPrice: 2000000,
      fuelTypes: 'Petrol,Diesel',
      sortBy: 'price'
    };

    service.getDashboardVehicles(filters).subscribe(res => {
      expect(res).toEqual(mockVehicles);
    });

    const req = httpMock.expectOne(request =>
      request.url === `${API}/dashboard`
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search')).toBe('SUV');
    expect(req.request.params.get('minPrice')).toBe('500000');
    expect(req.request.params.get('maxPrice')).toBe('2000000');
    expect(req.request.params.get('fuelTypes')).toBe('Petrol,Diesel');
    expect(req.request.params.get('sortBy')).toBe('price');

    req.flush(mockVehicles);
  });

  it('should ignore null, undefined, and empty filter values', () => {
    service.getDashboardVehicles({
      search: '',
      minPrice: null as any,
      maxPrice: undefined,
      sortBy: 'name'
    }).subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${API}/dashboard`
    );

    expect(req.request.method).toBe('GET');

    expect(req.request.params.has('search')).toBeFalse();
    expect(req.request.params.has('minPrice')).toBeFalse();
    expect(req.request.params.has('maxPrice')).toBeFalse();
    expect(req.request.params.get('sortBy')).toBe('name');

    req.flush([]);
  });

});
