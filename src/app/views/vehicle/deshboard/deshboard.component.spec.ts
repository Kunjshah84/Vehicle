import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeshboardComponent } from './deshboard.component';
import { VehicleService } from '../../../core/services/api/vehicle.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Vehicle } from '../../../shared/models/vehicle.model';

describe('DeshboardComponent', () => {
  let component: DeshboardComponent;
  let fixture: ComponentFixture<DeshboardComponent>;
  let vehicleService: jasmine.SpyObj<VehicleService>;
  let router: Router;

  beforeEach(async () => {
    vehicleService = jasmine.createSpyObj('VehicleService', [
      'getDashboardVehicles'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        DeshboardComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: VehicleService, useValue: vehicleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeshboardComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load vehicles successfully when applyFilters is called', () => {
    const mockVehicles: Vehicle[] = [
      {
        vehicalId: 1,
        vehicleName: 'Car A',
        model: 'ZX',
        basePrice: 1000000,
        stockCount: 3,
        shortDescription: 'Test car',
        fuleType: 'Petrol',
        bodyType: 'SUV',
        engine: 1500,
        thumbnail: null
      }
    ];

    vehicleService.getDashboardVehicles.and.returnValue(of(mockVehicles));

    component.applyFilters();

    expect(vehicleService.getDashboardVehicles).toHaveBeenCalled();
    expect(component.vehicles).toEqual(mockVehicles);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should set error message when vehicle loading fails', () => {
    vehicleService.getDashboardVehicles.and.returnValue(
      throwError(() => new Error('API Error'))
    );

    component.applyFilters();

    expect(vehicleService.getDashboardVehicles).toHaveBeenCalled();
    expect(component.vehicles.length).toBe(0);
    expect(component.error).toBe('Failed to load vehicles');
    expect(component.isLoading).toBeFalse();
  });


  it('should navigate to vehicle specification page', () => {
    component.goToVehicle(12);

    expect(router.navigate).toHaveBeenCalledWith([
      '/vehicalspecification',
      12
    ]);
  });
});
