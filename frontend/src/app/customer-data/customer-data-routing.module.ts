import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerDataPage } from './customer-data.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDataPageRoutingModule {}
