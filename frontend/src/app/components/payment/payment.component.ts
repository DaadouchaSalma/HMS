import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  private stripe: any;

  constructor() { }

  ngOnInit(): void {
    this.loadStripe();
  }

  async loadStripe() {
    this.stripe = await loadStripe('pk_test_51RIYcmR4Xlto1Mff3E5CbAULA8aD7SbfvGaUOuRfGaoo3xKSWBrYU3dpNiKvCd55Nc7x8BGH3y4URLCRIiQNl6dV00rdqXBb8r'); // Ta clé publique Stripe
  }

  async checkout() {
    const response = await fetch('http://localhost:5160/create-checkout-session', {
      method: 'POST',
    });

    const session = await response.json();

    const result = await this.stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  }

}
