import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PedidosComponent } from './pedidos/pedidos.component';
import { CarritoComponent } from './carrito/carrito.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MensajeConfirmacionComponent } from './mensaje-confirmacion/mensaje-confirmacion.component';
import { CheckoutLoginComponent } from './checkout/checkout-login/checkout-login.component';

@NgModule({
  declarations: [ HeaderComponent, PedidosComponent, CarritoComponent, CheckoutComponent, MensajeConfirmacionComponent, CheckoutLoginComponent ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    PedidosComponent,
    CarritoComponent,
    CheckoutComponent,
    MensajeConfirmacionComponent
  ]
})
export class SharedModule { }
