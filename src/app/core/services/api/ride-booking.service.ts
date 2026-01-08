import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PendingBookingDto } from '../../../shared/models/booking/PendingBookingDto';
import { Observable } from 'rxjs';
import { UserBooking } from '../../../shared/models/booking/user-booking.model';

@Injectable({
  providedIn: 'root'
})
export class RideBookingService {

  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  canBook(vehicleId: number) {
    const params = new HttpParams().set('vehicleId', vehicleId);

    return this.http.get<any>(
      `${this.baseUrl}/ride-bookings/can-book`,
      {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  getAvailableSlots(vehicleId: number, date: string) {
    const params = new HttpParams()
      .set('vehicleId', vehicleId)
      .set('date', date);

    return this.http.get<any>(
      `${this.baseUrl}/ride-bookings/available-slots`,
      { params }
    );
  }


  createBooking(payload: any) {
    return this.http.post<any>(
      `${this.baseUrl}/ride-bookings`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  getPendingBookings(): Observable<PendingBookingDto[]> {
    return this.http.get<PendingBookingDto[]>(`${this.baseUrl}/admin/pending`);
  }

  acceptBooking(bookingId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/accept/${bookingId}`, {});
  }

  rejectBooking(bookingId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/reject/${bookingId}`);
  }

   getMyUpcomingBookings(): Observable<UserBooking[]> {
    return this.http.get<UserBooking[]>(
      `${this.baseUrl}/ride-bookings/my-upcoming-bookings`
    );
  } 

}
