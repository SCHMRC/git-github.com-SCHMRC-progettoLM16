import { Component, OnInit } from '@angular/core';
import { GraphicService } from './../../services/graphic.service';
import * as operators from 'rxjs/operators';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit {
  users: any[] = [];
  displayedColumns: string[] = ['id', 'nome', 'email'];
  constructor(private graphic: GraphicService) { }

  ngOnInit(): void {

    this.graphic.getAllUser().pipe().subscribe((data)=> {
      this.users = data;
    });
  }

  test() {
    console.log(this.graphic.temp());
  }

}
