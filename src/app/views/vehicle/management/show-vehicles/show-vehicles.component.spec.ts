import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowVehiclesComponent } from './show-vehicles.component';
import { ManagerService } from '../../../../core/services/api/manager.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('ShowVehiclesComponent', () => {
  let component: ShowVehiclesComponent;
  let fixture: ComponentFixture<ShowVehiclesComponent>;

  const managerServiceMock = {
    getMyShowroomVehicles: jasmine
      .createSpy('getMyShowroomVehicles')
      .and.returnValue(of([])),
    deleteVehicle: jasmine
      .createSpy('deleteVehicle')
      .and.returnValue(of(void 0))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ShowVehiclesComponent,             
        RouterTestingModule.withRoutes([]) 
      ],
      providers: [
        { provide: ManagerService, useValue: managerServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
