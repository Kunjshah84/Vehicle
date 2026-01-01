import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVehiclesComponent } from './show-vehicles.component';

describe('ShowVehiclesComponent', () => {
  let component: ShowVehiclesComponent;
  let fixture: ComponentFixture<ShowVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
