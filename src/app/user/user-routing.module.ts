import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';


import { GuardGuard } from './../services/guard.guard';

const routes: Routes = [
  { path: 'user', component: UserComponent, canActivate: [GuardGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
export const COMPONENTS = [
  UserComponent
];
