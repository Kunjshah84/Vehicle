import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicalspecComponent } from './vehicalspec.component';

describe('VehicalspecComponent', () => {
  let component: VehicalspecComponent;
  let fixture: ComponentFixture<VehicalspecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicalspecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicalspecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
