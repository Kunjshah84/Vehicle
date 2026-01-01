import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeshboardComponent } from './deshboard.component';
import { VehicleService } from '../../../core/services/api/vehicle.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('DeshboardComponent', () => {
  let component: DeshboardComponent;
  let fixture: ComponentFixture<DeshboardComponent>;
  let vehicleServiceSpy: jasmine.SpyObj<VehicleService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockVehicles = [
    {
      vehicalId: 1,
      vehicleName: 'Honda',
      model: 'City',
      basePrice: 1000,
      stockCount: 5,
      shortDescription: 'Sedan car',
      fuleType: 'Petrol',
      bodyType: 'Sedan',
      engine: 1.5,
      thumbnail: null
    }
  ];

  beforeEach(async () => {
    vehicleServiceSpy = jasmine.createSpyObj('VehicleService', [
      'getDashboardVehicles'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DeshboardComponent],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeshboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call applyFilters on init', () => {
    spyOn(component, 'applyFilters').and.callThrough();
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should fetch vehicles successfully and stop loading', () => {
    vehicleServiceSpy.getDashboardVehicles.and.returnValue(of(mockVehicles));
    expect(vehicleServiceSpy.getDashboardVehicles).toHaveBeenCalled();
    expect(component.vehicles).toEqual(mockVehicles);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle API error correctly', () => {
    vehicleServiceSpy.getDashboardVehicles.and.returnValue(
      throwError(() => new Error('API failed'))
    );

    fixture.detectChanges();

    expect(component.error).toBe('Failed to load vehicles');
    expect(component.isLoading).toBeFalse();
  });

  it('should add value to filter array on checkbox checked', () => {
    const event = {
      target: { value: 'Petrol', checked: true }
    };

    component.onCheckboxChange(event, 'fuelTypes');

    expect(component.filters.fuelTypes).toContain('Petrol');
  });

  it('should remove value from filter array on checkbox unchecked', () => {
    component.filters.fuelTypes = ['Petrol'];

    const event = {
      target: { value: 'Petrol', checked: false }
    };

    component.onCheckboxChange(event, 'fuelTypes');

    expect(component.filters.fuelTypes).not.toContain('Petrol');
  });

  it('should reset filters and reapply filters', () => {
    vehicleServiceSpy.getDashboardVehicles.and.returnValue(of([]));
    spyOn(component, 'applyFilters').and.callThrough();

    component.filters.search = 'Honda';
    component.filters.fuelTypes = ['Petrol'];

    component.resetFilters();

    expect(component.filters.search).toBeNull();
    expect(component.filters.fuelTypes.length).toBe(0);
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should navigate to vehicle specification page', () => {
    component.goToVehicle(10);

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/vehicalspecification',
      10
    ]);
  });
});
