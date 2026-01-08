import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditVehicleComponent } from './edit-vehicle.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { VehicleSpecService } from '../../../../core/services/api/vehicle-spec.service';
import { ManagerService } from '../../../../core/services/api/manager.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('EditVehicleComponent', () => {
  let component: EditVehicleComponent;
  let fixture: ComponentFixture<EditVehicleComponent>;
  let managerServiceSpy: jasmine.SpyObj<ManagerService>;
  let vehicleSpecServiceSpy: jasmine.SpyObj<VehicleSpecService>;
  let router: Router;

  beforeEach(async () => {
    managerServiceSpy = jasmine.createSpyObj('ManagerService', [
      'updateVehicle',
      'getVehicleImages',
      'saveVehicleImages'
    ]);

    vehicleSpecServiceSpy = jasmine.createSpyObj('VehicleSpecService', [
      'getVehicleDetails'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        EditVehicleComponent,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: ManagerService, useValue: managerServiceSpy },
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
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditVehicleComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    vehicleSpecServiceSpy.getVehicleDetails.and.returnValue(
      of({
        vehicalId: 1,
        vehicleName: 'Car',
        model: 'ZX',
        yearOfProduction: 2022,
        ageInShowroom: '2024-01-01',
        basePrice: 1000000,
        stockCount: 2,
        shortDescription: 'Test',
        images: [],
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
      })
    );

    managerServiceSpy.getVehicleImages.and.returnValue(
      of({ message: 'ok', images: [] })
    );

    fixture.detectChanges();
  });


  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should update vehicle and navigate on submit', fakeAsync(() => {
    spyOn(window, 'alert');

    managerServiceSpy.updateVehicle.and.returnValue(
      of({ message: 'Vehicle updated' })
    );

    component.vehicleForm.setValue({
      vehicleName: 'Updated Car',
      model: 'ZX',
      yearOfProduction: 2022,
      ageInShowroom: '2024-01-01',
      basePrice: 1200000,
      stockCount: 3,
      shortDescription: 'Updated',
      engine: 1600,
      powerOfVehical: '130hp',
      torque: '270Nm',
      fuelType: 'Petrol',
      mileage: '17kmpl',
      bodyType: 'SUV',
      seatingCapacity: 5
    });

    component.onSubmit();
    tick();

    expect(managerServiceSpy.updateVehicle)
      .toHaveBeenCalledWith(1, jasmine.any(Object));

    expect(window.alert)
      .toHaveBeenCalledWith('Vehicle updated');

    expect(router.navigate)
      .toHaveBeenCalledWith(['/vehicle-management/show-vehicles']);
  }));

  it('should navigate back to vehicle list', () => {
    component.goBack();

    expect(router.navigate)
      .toHaveBeenCalledWith(['/vehicle-management/show-vehicles']);
  });


  it('should load vehicle images on init', () => {
    expect(managerServiceSpy.getVehicleImages)
      .toHaveBeenCalledWith(1);

    expect(component.images)
      .toEqual([]);
  });
});
