import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'etiquetas';

  constructor() {
    if (localStorage.getItem('impresora') === null) {
      localStorage.setItem('impresora', '1');
    }
    if (localStorage.getItem('etiqueta') === null) {
      localStorage.setItem('etiqueta', '1');
    }
    if (localStorage.getItem('local') === null) {
      localStorage.setItem('local', 'T');
    }
    if (localStorage.getItem('etiquetaZPL') === null) {
      localStorage.setItem('etiquetaZPL', 'etiquetaGrande');
    }
  }
}
