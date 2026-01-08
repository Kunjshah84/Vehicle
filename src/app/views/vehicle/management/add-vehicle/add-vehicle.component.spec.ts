import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddVehicleComponent } from './add-vehicle.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ManagerService } from '../../../../core/services/api/manager.service';
import { of } from 'rxjs';
describe('AddVehicleComponent', () => {
  let component: AddVehicleComponent;
  let fixture: ComponentFixture<AddVehicleComponent>;
  const mockManagerService = {
    createVehicleWithSpec: jasmine.createSpy('createVehicleWithSpec').and.returnValue(of({ vehicleId: 1 })),
    saveVehicleImages: jasmine.createSpy('saveVehicleImages').and.returnValue(of({}))
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ManagerService, useValue: mockManagerService }
      ] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
