import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { environment } from './../environments/environment';
import { AppRoutingModule, COMPONENTS } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgpSortModule } from 'ngp-sort-pipe';
import { MDBBootstrapModule } from 'angular-bootstrap-md';



import { MaterialModule } from './material/material.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';









@NgModule({
  declarations: [
    AppComponent,
    COMPONENTS
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule,
    ToastrModule.forRoot(),
    MaterialModule,
    AuthModule,
    UserModule,
    AppRoutingModule,
    NgpSortModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule
  ],
  providers: [AngularFireAuth, AngularFireDatabase, AngularFireStorage],
  bootstrap: [AppComponent]
})
export class AppModule { }
