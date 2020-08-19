import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LightboxModule } from 'ngx-lightbox';
import { MaterialModule } from './../material/material.module';
import { UserRoutingModule, COMPONENTS } from './user-routing.module';
import { WorkListComponent } from './work-list/work-list.component';
import { InsertWorkComponent } from './insert-work/insert-work.component';
import { GraphicComponent } from './graphic/graphic.component';
import { DraftWorkComponent } from './draft-work/draft-work.component';
import { NumeroPipe } from './../services/numero.pipe';
import { ToastrModule } from 'ngx-toastr';
import { NgpSortModule } from 'ngp-sort-pipe';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgFileDragDropModule } from 'ng-file-drag-drop';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DraftWorkListComponent } from './draft-work-list/draft-work-list.component';
import { SuccessOrderComponent } from './success-order/success-order.component';
import 'hammerjs';






@NgModule({
  declarations: [
    COMPONENTS,
    WorkListComponent,
    InsertWorkComponent,
    DraftWorkComponent,
    GraphicComponent,
    NumeroPipe,
    DraftWorkListComponent,
    SuccessOrderComponent],
  imports: [
    CommonModule,
    NgFileDragDropModule,
    MDBBootstrapModule.forRoot(),
    NgxDatatableModule,
    LightboxModule,
    ToastrModule.forRoot(),
    ButtonModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NgpSortModule,
    UserRoutingModule
  ]
})
export class UserModule { }
