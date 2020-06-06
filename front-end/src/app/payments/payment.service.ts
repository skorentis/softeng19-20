import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PaymentService {

  userToken: string;

  constructor(private http: HttpClient, private authService: AuthService) {}

  processPayment(amount: string, name: string, strTokenId: string) {
    const userToken = this.authService.getToken();
    const paymentData = {
      stripeName: name,
      stripeTokenId: strTokenId,
      stripeAmount: amount,
      token: userToken
    };
    return this.http.post('https://localhost:8765/energy/api/charge', paymentData);
  }

  getDeals() {
    console.log('trying to get packets');
    return this.http.get('https://localhost:8765/energy/api/getpackets');
  }
}
