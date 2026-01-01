export interface VehicleImage {
  imageLocation: string;
  sortOrder: number;
}

export interface VehicleSpecification {
  engine: number;
  powerOfvehical: string;
  torque: string;
  fuleType: string;
  mileage: string;
  bodyType: string;
  seatingCapacity: number;
}

export interface VehicleDetails {
  vehicalId: number;
  vehicleName: string;
  model: string;
  yearOfProduction: number;
  basePrice: number;
  stockCount: number;
  shortDescription: string;
  images: VehicleImage[];
  specifications: VehicleSpecification[];
}
