export interface UserBooking {
  bookingId: number;
  vehicleId: number;
  vehicleName: string;
  vehiclePrimaryImage: string | null;

  bookingDate: string;        
  slotHour: number;           
  status: string;
  bookingCreatedAt: string;   
}
