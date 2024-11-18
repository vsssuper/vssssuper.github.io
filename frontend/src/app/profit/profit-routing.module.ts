import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfitPage } from './profit.page';

const routes: Routes = [
  {
    path: '',
    component: ProfitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfitPageRoutingModule {}
