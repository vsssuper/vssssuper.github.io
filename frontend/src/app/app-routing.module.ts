import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule) },
  { path: 'customer-data', canActivate: [AuthGuard], loadChildren: () => import('./customer-data/customer-data.module').then(m => m.CustomerDataPageModule) },
  { path: 'turnover', canActivate: [AuthGuard], loadChildren: () => import('./turnover/turnover.module').then(m => m.TurnoverPageModule) },
  { path: 'profit', canActivate: [AuthGuard], loadChildren: () => import('./profit/profit.module').then(m => m.ProfitPageModule) },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
