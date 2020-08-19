import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <div class="alert-danger">
     {{msgError}}
    </div>
  `,
  styles: [
  ]
})
export class ErrorComponent implements OnInit {
  @Input() msgError: any;

  constructor() { }

  ngOnInit(): void {
  }

}
