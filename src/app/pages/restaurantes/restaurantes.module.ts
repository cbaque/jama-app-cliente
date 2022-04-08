import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantesRoutingModule } from './restaurantes-routing.module';
import { RestaurantesComponent } from './restaurantes.component';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ RestaurantesComponent ],
  imports: [
    CommonModule,
    IonicModule,
    RestaurantesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class RestaurantesModule { }
