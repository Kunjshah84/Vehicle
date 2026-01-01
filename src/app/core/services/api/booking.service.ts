import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../../../shared/models/booking/booking.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  bookRide(vehicleId: number): Observable<Booking> {
    return this.http.post<Booking>(
      `${this.baseUrl}/Booking/book-ride/${vehicleId}`,
      {}
    );
  }
}
