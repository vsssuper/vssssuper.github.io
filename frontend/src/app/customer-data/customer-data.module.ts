import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerDataPageRoutingModule } from './customer-data-routing.module';

import { CustomerDataPage } from './customer-data.page';
import { HttpClientModule } from '@angular/common/http'; 
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerDataPageRoutingModule,
    HttpClientModule
  ],
  declarations: [CustomerDataPage],
  providers: [FileChooser, File]
})
export class CustomerDataPageModule {}
