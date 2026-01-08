import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleSpecService } from '../../../core/services/api/vehicle-spec.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { VehicleDetails } from '../../../shared/models/vehicle-details.model';
import { VehicalspecComponent } from './vehicalspec.component';

describe('VehicalspecComponent', () => {
  let component: VehicalspecComponent;
  let fixture: ComponentFixture<VehicalspecComponent>;
  let vehicleSpecService: jasmine.SpyObj<VehicleSpecService>;
  let router: Router;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => (key === 'id' ? '5' : null)
      }
    }
  };

  beforeEach(async () => {
    vehicleSpecService = jasmine.createSpyObj('VehicleSpecService', [
      'getVehicleDetails'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        VehicalspecComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: VehicleSpecService, useValue: vehicleSpecService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicalspecComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load vehicle details successfully on init', () => {
    const mockVehicle: VehicleDetails = {
      vehicalId: 5,
      vehicleName: 'Test Car',
      model: 'ZX',
      yearOfProduction: 2023,
      ageInShowroom: '2024-01-01',
      basePrice: 1200000,
      stockCount: 2,
      shortDescription: 'Test description',
      images: [
        { imageLocation: 'img1.jpg', sortOrder: 1 }
      ],
      specifications: [
        {
          engine: 1500,
          powerOfvehical: '120hp',
          torque: '250Nm',
          fuleType: 'Petrol',
          mileage: '18kmpl',
          bodyType: 'SUV',
          seatingCapacity: 5
        }
      ]
    };

    vehicleSpecService.getVehicleDetails.and.returnValue(
      of(mockVehicle)
    );

    component.ngOnInit();

    expect(vehicleSpecService.getVehicleDetails).toHaveBeenCalledWith(5);
    expect(component.vehicle).toEqual(mockVehicle);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });


  it('should set error message when loading vehicle details fails', () => {
    vehicleSpecService.getVehicleDetails.and.returnValue(
      throwError(() => new Error('API Error'))
    );

    component.ngOnInit();

    expect(vehicleSpecService.getVehicleDetails).toHaveBeenCalledWith(5);
    expect(component.error).toBe('Failed to load vehicle data.');
    expect(component.isLoading).toBeFalse();
  });


  it('should navigate back to vehicles list', () => {
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/vehicles']);
  });

  it('should navigate to book-ride page with vehicle id', () => {
    component.bookRide();

    expect(router.navigate).toHaveBeenCalledWith(['book-ride', '5']);
  });
});
