import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicalspecComponent } from './vehicalspec.component';
import { VehicleSpecService } from '../../../core/services/api/vehicle-spec.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VehicleDetails } from '../../../shared/models/vehicle-details.model';

describe('VehicalspecComponent', () => {
  let component: VehicalspecComponent;
  let fixture: ComponentFixture<VehicalspecComponent>;
  let vehicleSpecServiceSpy: jasmine.SpyObj<VehicleSpecService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockVehicleDetails: VehicleDetails = {
    vehicalId: 1,
    vehicleName: 'Honda',
    model: 'City',
    yearOfProduction: 2024,
    basePrice: 1200,
    stockCount: 5,
    shortDescription: 'Comfortable sedan',

    images: [
      {
        imageLocation: 'img1.jpg',
        sortOrder: 1
      },
      {
        imageLocation: 'img2.jpg',
        sortOrder: 2
      }
    ],

    specifications: [
      {
        engine: 1.5,
        powerOfvehical: '121 bhp',
        torque: '145 Nm',
        fuleType: 'Petrol',
        mileage: '18 km/l',
        bodyType: 'Sedan',
        seatingCapacity: 5
      }
    ]
  };

  beforeEach(async () => {
    vehicleSpecServiceSpy = jasmine.createSpyObj(
      'VehicleSpecService',
      ['getVehicleDetails']
    );

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [VehicalspecComponent],
      providers: [
        { provide: VehicleSpecService, useValue: vehicleSpecServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicalspecComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    vehicleSpecServiceSpy.getVehicleDetails.and.returnValue(
      of(mockVehicleDetails)
    );

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should call getVehicleDetails with route id', () => {
    vehicleSpecServiceSpy.getVehicleDetails.and.returnValue(
      of(mockVehicleDetails)
    );

    fixture.detectChanges();

    expect(vehicleSpecServiceSpy.getVehicleDetails).toHaveBeenCalledWith(1);
  });

  it('should set vehicle details and stop loading on success', () => {
    vehicleSpecServiceSpy.getVehicleDetails.and.returnValue(
      of(mockVehicleDetails)
    );

    fixture.detectChanges();

    expect(component.vehicle).toEqual(mockVehicleDetails);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle API error properly', () => {
    vehicleSpecServiceSpy.getVehicleDetails.and.returnValue(
      throwError(() => new Error('API failed'))
    );

    fixture.detectChanges();

    expect(component.error).toBe('Failed to load vehicle data.');
    expect(component.isLoading).toBeFalse();
  });

  it('should navigate back to vehicles list', () => {
    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/vehicles']);
  });

  it('should navigate to book-ride with vehicle id', () => {
    component.bookRide();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['book-ride', '1']);
  });
});
