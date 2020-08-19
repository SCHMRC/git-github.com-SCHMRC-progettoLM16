import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


import {MaterialModule} from './../material/material.module'
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule, COMPONENTS } from './auth-routing.module';
import { ErrorComponent } from './../shared/error/error.component';


@NgModule({
  declarations: [ErrorComponent, COMPONENTS],
  imports: [
    MDBBootstrapModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
