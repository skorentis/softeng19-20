import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { PaymentService } from '../payment.service';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.css']
})
export class PopupFormComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild('cardInfo', {static: false}) cardInfo: ElementRef;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  isLoading = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private paymentService: PaymentService,
    private dialogRef: MatDialogRef<PopupFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.changeDetector.detectChanges();
  }

  async onSubmit(form: NgForm) {
    this.isLoading = true;
    const { token, error } = await stripe.createToken(this.card);

    if (error) {
      console.log('Something is wrong:', error);
    } else {
      console.log('Success!', token);
      // ...send the token to the your backend to process the charge
      this.paymentService.processPayment(this.data.dealAmount, this.data.dealName, token.id).
        subscribe(response => {
          alert('Succes');
          this.dialogRef.close();
          this.isLoading = false;

        }, err => {
          console.log(err);
          alert(err);
          this.dialogRef.close();
          this.isLoading = false;
        });

    }
  }

}
