import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { GraphicService } from 'src/app/services/graphic.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
//tslint:disable

@Component({
  selector: 'app-success-order',
  templateUrl: './success-order.component.html',
  styleUrls: ['./success-order.component.scss']
})
export class SuccessOrderComponent implements OnInit {


  constructor(private graphicService: GraphicService, private lightbox: Lightbox, private orderService: OrderService, private userService: UserService) { }

  ngOnInit(): void {

  }

}

