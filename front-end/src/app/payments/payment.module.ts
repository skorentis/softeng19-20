import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { PaymentService } from './payment.service';
import { AngularMaterialModule } from '../angular-material.module';
import { FormsModule } from '@angular/forms';
import { PopupFormComponent } from './popup-form/popup-form.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule
  ],
  declarations: [
    MakePaymentComponent,
    PopupFormComponent
  ],
  entryComponents: [
    PopupFormComponent
  ],
  providers: [
    PaymentService
  ]

})
export class PaymentModule {}
