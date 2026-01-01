import { BookingUser } from './booking-user.model';
import { BookingVehicle } from './booking-vehicle.model';
import { BookingShowroom } from './booking-showroom.model';

export interface Booking {
  rideStatus: string;
  startDate: string;
  endDate: string;
  user: BookingUser;
  vehicle: BookingVehicle;
  showroom: BookingShowroom;
}
