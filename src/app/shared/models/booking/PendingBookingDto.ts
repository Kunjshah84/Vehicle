export interface PendingBookingDto {
  bookingId: number;
  customerName: string;
  bookingDate: string; 
  slotHour: number;
  status: string;
  bookingCreatedAt: string;
  vehicleName: string;
}