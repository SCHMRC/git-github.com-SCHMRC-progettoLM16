import { Component, OnInit } from '@angular/core';
import { Order } from '../services/order';
import { OrderService } from '../services/order.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
//tslint:disable

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
  }

}





