export interface Vehicle {
  vehicalId: number;
  vehicleName: string;
  model: string;
  basePrice: number;
  stockCount: number;
  shortDescription: string;
  fuleType: string;
  bodyType: string;
  engine: number;
  thumbnail: string | null;
}
