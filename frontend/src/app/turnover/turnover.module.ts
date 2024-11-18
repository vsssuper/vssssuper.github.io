import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TurnoverPageRoutingModule } from './turnover-routing.module';
import { HttpClientModule } from '@angular/common/http'; 

import { TurnoverPage } from './turnover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TurnoverPageRoutingModule,
    HttpClientModule
  ],
  declarations: [TurnoverPage]
})
export class TurnoverPageModule {}
