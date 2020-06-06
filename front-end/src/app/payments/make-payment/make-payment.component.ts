import { Component, OnInit, HostListener, Host, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
// import { PaymentService } from '../payment.service';
// import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';
import { PaymentService } from '../payment.service';
import { DealData } from '../deal.model';
import { MatDialog } from '@angular/material';
import { PopupFormComponent } from '../popup-form/popup-form.component';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MakePaymentComponent implements OnInit {
  // handler: any;
  // amount = 500; // == $5.00

  // constructor(private paymentService: PaymentService) { }

  // ngOnInit() {
  //   this.handler = StripeCheckout.configure({
  //     key: environment.stripeKey,
  //     locale: 'auto',
  //     token: token => {
  //       this.paymentService.processPayment(token, this.amount);
  //     }
  //   });
  // }

  // // This will trigger the stripe window to pop up
  // handlePayment() {
  //   this.handler.open({
  //     name: 'Buy Quotas',
  //     description: 'Buy some more quotas',
  //     amount: this.amount
  //   });
  // }

  // @HostListener('window:popstate')
  // onPopstate() {
  //   this.handler.close();
  // }

  // @ViewChild('cardInfo', {static: false}) cardInfo: ElementRef;

  // card: any;
  // cardHandler = this.onChange.bind(this);
  // error: string;

  deals: DealData[];
  private amount: string;
  private name: string;

  constructor(private paymentService: PaymentService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getDeals();
  }

  // ngAfterViewInit() {
  //   this.card = elements.create('card');
  //   this.card.mount(this.cardInfo.nativeElement);

  //   this.card.addEventListener('change', this.cardHandler);
  // }

  // ngOnDestroy() {
  //   this.card.removeEventListener('change', this.cardHandler);
  //   this.card.destroy();
  // }

  // onChange({ error }) {
  //   if (error) {
  //     this.error = error.message;
  //   } else {
  //     this.error = null;
  //   }
  //   this.changeDetector.detectChanges();
  // }

  // async onSubmit(form: NgForm) {
  //   const { token, error } = await stripe.createToken(this.card);

  //   if (error) {
  //     console.log('Something is wrong:', error);
  //   } else {
  //     console.log('Success!', token);
  //     // ...send the token to the your backend to process the charge
  //     this.paymentService.processPayment(this.amount, this.name, token.id).
  //       subscribe(response => {
  //         alert(response);
  //       }, err => {
  //         console.log(err);
  //         alert(err);
  //       });

  //   }
  // }

  getDeals() {
    this.paymentService.getDeals()
      .subscribe((dealsResult: any) => {
        const deals = dealsResult;
        this.deals = deals;
        console.log(this.deals);
      }, error => {
        console.log(error);
      });
  }

  onPurchaseButton(name: string, amount: string) {
    this.name = name;
    this.amount = amount;

    this.openDialog();
  }

  openDialog() {
    let dialogRef = this.dialog.open(PopupFormComponent,
      {
        data: {
          dealName: this.name,
          dealAmount: this.amount
        },
        // height: '300px',
        width: '500px'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    })

  }
}


