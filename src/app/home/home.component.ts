import { Component, OnInit } from '@angular/core';
import { Order } from '../services/order';
import { OrderService } from '../services/order.service';
//tslint:disable

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  order: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
  }

  onClick() {
    this.orderService.control('UjRGX6NVN4aNJnZbgqjz89A9sTE3')

    this.orderService.getAllProjectSnap('UjRGX6NVN4aNJnZbgqjz89A9sTE3').then((snapshot) => {

      snapshot.forEach(element => {
        this.order.push(new Order(
          element.val()['data'],
          element.val()['id'],
          element.val()['nome'],
          element.val()['pezzi'],
          element.val()['progetto']))
      })


    })

  }

}
