import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-etiqueta-zpl',
  templateUrl: './config-etiqueta-zpl.component.html',
  styleUrls: ['./config-etiqueta-zpl.component.scss'],
})
export class ConfigEtiquetaZPLComponent implements OnInit {
  etiquetas: string[] = [
    'etiquetaGrande',
    'etiquetaChiquita',
    'etiquetaGrandeSinPrecio',
    'etiquetaChiquitaSinPrecio',
    'etiquetaPrecioUnica',
  ];
  etiquetaStorage: string | null = localStorage.getItem('etiquetaZPL');

  ngOnInit() {}

  seleccionarEtiqueta(etiqueta: string) {
    this.etiquetaStorage = etiqueta;
    localStorage.setItem('etiquetaZPL', etiqueta);
    // Puedes realizar acciones adicionales aquí, como imprimir la etiqueta.
  }
}
