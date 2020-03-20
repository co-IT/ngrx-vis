import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styles: [
    `
      h1 {
        color: white;
        font-family: Lato;
        text-align: center;
        margin: 0;
      }

      h2 {
        color: white;
        font-family: Lato;
        font-weight: 400;
        text-align: center;
        margin: 0;
        padding-top: 8px;
      }
    `
  ]
})
export class AppComponent {}
