import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleImageComponent } from './add-vehicle-image.component';

describe('AddVehicleImageComponent', () => {
  let component: AddVehicleImageComponent;
  let fixture: ComponentFixture<AddVehicleImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVehicleImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
