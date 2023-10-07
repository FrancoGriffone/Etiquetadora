import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-config-etiqueta',
  templateUrl: './config-etiqueta.component.html',
  styleUrls: ['./config-etiqueta.component.scss'],
})
export class ConfigEtiquetaComponent implements OnInit {
  etiquetas: any;
  etiquetaStorage = localStorage.getItem('etiqueta');
  constructor(private service: AppService) {
    this.service.getEtiquetas().subscribe((resp) => {
      this.etiquetas = resp;
    });
  }

  ngOnInit(): void {}
  seleccionado(ev: any) {
    localStorage.setItem('etiqueta', ev);
    this.etiquetaStorage = localStorage.getItem('etiqueta');
  }
}
