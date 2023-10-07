import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-config-impresora',
  templateUrl: './config-impresora.component.html',
  styleUrls: ['./config-impresora.component.scss'],
})
export class ConfigImpresoraComponent implements OnInit {
  impresoras: any;
  impresoraStorage = localStorage.getItem('impresora');
  constructor(private service: AppService) {
    this.service.getImpresoras().subscribe((resp) => {
      this.impresoras = resp;
    });
  }

  ngOnInit(): void {}

  seleccionado(ev: any) {
    localStorage.setItem('impresora', ev);
    this.impresoraStorage = localStorage.getItem('impresora');
  }
}
