import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-impresion',
  templateUrl: './impresion.component.html',
  styleUrls: ['./impresion.component.scss'],
})
export class ImpresionComponent implements OnInit {
  datos: any = {};
  widthBarcode = 1.4;
  heightBarcode = 40;

  constructor(private service: AppService) {}

  public get codigo() {
    return this.service.codigo;
  }

  ngOnInit(): void {
    this.traerDatosImpresion();
  }

  traerDatosImpresion() {
    this.service.getDatos('0002958330003').subscribe((resp) => {
      this.datos = resp[0];
      console.log(this.datos);
      // LUEGO DE QUE SE CARGUE EL HTML CON LO QUE TRAE EL BACKEND, LO QUE HACE ESTA LINEA DE CODIGO ES AUTOCLICKEARSE Y SALTA EL PRIMER PREVIEW
      // setTimeout(() => {
      //   //@ts-ignore
      //   document.getElementById('submitButton').click();
      // }, 100);
      // FCOMENT;
    });
  }
}
