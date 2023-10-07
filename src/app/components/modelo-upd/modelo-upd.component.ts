import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { NotifService } from 'src/app/services/notif.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modelo-upd',
  templateUrl: './modelo-upd.component.html',
  styleUrls: ['./modelo-upd.component.scss'],
})
export class ModeloUpdComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    codigo: ['', [Validators.required, Validators.minLength(3)]],
    tecladoActivado: true,
  });

  //@ts-ignore
  private refrescarTabla: Subscription;

  @ViewChild('inputCodigo', { static: false }) inputCodigo: any = ElementRef;

  /* CONFIGURACION DE LA COLA DE IMPRESION */
  QUEUE_INTERVAL = 50;
  respuesta: any;
  isError = 'null';
  nombreImpresora: any;
  nombrePrinter: any; //ESTE ES EL NOMBRE DE LA IMPRESORA. Ej. ZEBRA GK420t
  ipImpresora: any;
  nombreEtiqueta: any;
  nombreLocal: any;
  nombreEtiquetaZPL: any;
  fechaHoy: string;
  showError: boolean = false;
  inputMode: boolean = false;
  textTeclado: string = '¿Activar Teclado?';

  constructor(
    private fb: FormBuilder,
    public service: AppService,
    private router: Router,
    public notif: NotifService
  ) {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoy.getDate().toString().padStart(2, '0');

    this.fechaHoy = `${año}${mes}${dia}`;

    this.getImpresoras();
    this.getEtiqueta();
    this.getLocales();
  }

  ngOnInit(): void {
    setInterval(this.queueWorker.bind(this), this.QUEUE_INTERVAL);

    this.refrescarTabla = this.notif.subscribeEvent<string>('refrescar', () => {
      this.getImpresoras();
      this.getEtiqueta();
      this.getLocales();
    });

    this.nombreEtiquetaZPL = localStorage.getItem('etiquetaZPL');
  }

  //MODULARIZACION DE GET IMPRESORAS - ETIQUETAS - LOCALES
  getImpresoras() {
    this.service.getImpresoras().subscribe((resp) => {
      this.respuesta = resp;
      this.nombreImpresora = resp
        .filter((x: any) => x.id == localStorage.getItem('impresora'))
        .map((e: any) => e.descripcion);

      this.ipImpresora = resp
        .filter((x: any) => x.id == localStorage.getItem('impresora'))
        .map((e: any) => e.direccionIp);

      this.nombrePrinter = resp
        .filter((x: any) => x.id == localStorage.getItem('impresora'))
        .map((e: any) => e.impresora);
    });
  }

  getEtiqueta() {
    this.service.getEtiquetas().subscribe((resp) => {
      const respuesta = resp;
      this.nombreEtiqueta = respuesta
        .filter((x: any) => x.id == localStorage.getItem('etiqueta'))
        .map((e: any) => e.tipoEtiqueta);
    });
  }

  getLocales() {
    this.service.getLocales().subscribe((resp) => {
      const respuesta = resp;
      this.nombreLocal = respuesta
        .filter((x: any) => x.id == localStorage.getItem('local'))
        .map((e: any) => e.local);
    });
  }
  //FIN MODULARIZACION DE GET IMPRESORAS - ETIQUETAS - LOCALES

  //SERVICIOS QUE IMPRIMEN
  mandarCodigo(codigo: any) {
    const local = localStorage.getItem('local');
    const ipImpresora = this.respuesta
      .filter((x: any) => x.id == localStorage.getItem('impresora'))
      .map((e: any) => e.direccionIp);

    this.service.getDatosXLocal(codigo, local).subscribe(
      (resp) => {
        this.showError = true;
        if (resp.length === 0) {
          this.isError = 'ERROR';
        } else {
          const etiqueta = this.etiquetas(resp[0]);
          this.service
            .imprimirZPL(etiqueta, ipImpresora)
            .subscribe((resp) => {});
          this.isError = 'SUCCESS';
        }

        setTimeout(() => {
          this.showError = false;
          this.isError = 'PENDING';
        }, 2000);
      },
      (error) => {
        this.showError = true;
        this.isError = 'ERROR';
        setTimeout(() => {
          this.showError = false;
          this.isError = 'PENDING';
        }, 2000);
      }
    );
  }

  mandarCodigoUSB(codigo: any) {
    const local = localStorage.getItem('local');

    this.service.getDatosXLocal(codigo, local).subscribe(
      (resp) => {
        this.showError = true;
        if (resp.length === 0) {
          this.isError = 'ERROR';
        } else {
          const etiqueta = this.etiquetas(resp[0]);
          this.service
            .imprimirUSB(this.ipImpresora, this.nombrePrinter, etiqueta)
            .subscribe(
              (resp) => {
                if (resp.success == true) {
                  this.isError = 'SUCCESS';
                } else {
                  Swal.fire('Error', resp.message, 'error');
                }
              },
              (error) => {
                Swal.fire('Error', error.message, 'error');
              }
            );
        }

        setTimeout(() => {
          this.showError = false;
          this.isError = 'PENDING';
        }, 2000);
      },
      (error) => {
        this.showError = true;
        this.isError = 'ERROR';
        setTimeout(() => {
          this.showError = false;
          this.isError = 'PENDING';
        }, 2000);
      }
    );
  }
  //FIN SERVICIOS QUE IMPRIMEN

  onBlur(event: any) {
    this.inputCodigo.nativeElement.focus();
  }

  enviarCodigoACola() {
    const value = this.miFormulario.value.codigo;
    console.log('AGREGANDO EL CODIGO ', value, 'A LA COLA DE IMPRESION');

    this.service.colaCodigos.push(value);

    this.miFormulario.patchValue({
      codigo: null,
    });
  }

  queueWorker() {
    const [usbImpresora] = this.respuesta
      .filter((x: any) => x?.id == localStorage.getItem('impresora'))
      .map((e: any) => e.usb);

    if (this.service.colaCodigos.length > 0) {
      const codigo = this.service.colaCodigos.shift();
      if (usbImpresora) {
        this.mandarCodigoUSB(codigo);
      } else {
        this.mandarCodigo(codigo);
      }
    }
  }
  imagen(): any {
    if (this.isError == 'PENDING') {
      return null;
    }
    if (this.isError == 'ERROR') {
      return {
        'background-image': 'url(' + 'assets/incorrecto.jpg' + ')',
        'background-color': '#e01c1d',
      };
    }
    if (this.isError == 'SUCCESS') {
      return {
        'background-image': 'url(' + 'assets/correcto.jpg' + ')',
        'background-color': '#2fa125',
      };
    }
  }

  etiquetas(data: any) {
    const nombreEtiquetaZPL = localStorage.getItem('etiquetaZPL');

    const etiquetaGrande = `^FWI^FO50,20,^A0,50,50^FD$${data.precio}^FS^FO270,90,1^A0,30,30^FD${data.talle}^FS^FO270,410,1^A0,30,30^FD${data.ubicacion}^FS^FWR^FO190,150^BY2,3,80^BCR,80,Y,N,N,A^FD${data.codigo}^FS^CFA,20^FO100,100^A0,25,25^FD${data.detalle1}^FS^FO80,100^FD${data.detalle2}^FS^FO60,100^FD${data.marca}^FS^FO40,100^FD${data.codigoProdProvee}^FS^FO20,100^FD${data.fultCompra} | ${this.fechaHoy}^FS`;

    const etiquetaChiquita = `^FWR^FO310,30,^A0,30,30^FD$${data.precio}^FS^FO300,20,1^A0,20,20^FDTalle ${data.talle}^FS^FO15,20^A0R,20,20^FD${data.ubicacion}^FS^FWI^FO30,125^BY2,3,80^BC,30,Y,N,N,A^FD${data.codigo}^FS^FO275,75,1^A0,20,20^FD${data.detalle1}^FS^FO275,60,1^A0,15,15^FD${data.detalle2}^FS^FO275,45,1^A0,15,15^FD${data.marca}^FS^FO275,30,1^A0,15,15^FD${data.codigoProdProvee}^FS^FO275,15,1^A0,15,15^FD${data.fultCompra} | ${this.fechaHoy}^FS`;

    const etiquetaGrandeSinPrecio = `^FWI^FO270,90,1^A0,30,30^FD${data.talle}^FS^FO270,410,1^A0,30,30^FD${data.ubicacion}^FS^FWR^FO190,150^BY2,3,80^BCR,80,Y,N,N,A^FD${data.codigo}^FS^CFA,20^FO100,100^A0,25,25^FD${data.detalle1}1^FS^FO80,100^FD${data.detalle2}^FS^FO60,100^FD${data.marca}^FS^FO40,100^FD${data.codigoProdProvee}^FS^FO20,100^FD${data.fultCompra} | ${this.fechaHoy}^FS`;

    const etiquetaChiquitaSinPrecio = `^FS^FO15,20^A0R,20,20^FD${data.ubicacion}^FS^FWI^FO50,125^BY2,3,80^BC,30,Y,N,N,A^FD${data.codigo}^FS^FO340,75,1^A0,20,20^FD${data.detalle1}^FS^FO340,60,1^A0,15,15^FD${data.detalle2}^FS^FO340,45,1^A0,15,15^FD${data.marca}^FS^FO340,30,1^A0,15,15^FDAP ${data.codigoProdProvee}^FS^FO340,15,1^A0,15,15^FD${data.fultCompra} | ${this.fechaHoy}^FS`;

    const etiquetaPrecioUnica = `^FS^FWI^FO100,110^A0,40,40^FD$${data.precio}^FS^FWI^FO15,35^A0,30,25^FD${data.ubicacion}^FS^FWI^FO50,80^BY2,3,80^BC,30,Y,N,N,A^FD${data.codigo}^FS^FO340,35,1^A0,20,15^FD${data.marca}^FS^FO340,15,1^A0,20,15^FD${data.codigoProdProvee}^FS^FO150,15,1^A0,20,15^FD${data.fultCompra} | ${this.fechaHoy}`;

    //FRANCO

    switch (nombreEtiquetaZPL) {
      case 'etiquetaGrande':
        return etiquetaGrande;
      case 'etiquetaChiquita':
        return etiquetaChiquita;
      case 'etiquetaGrandeSinPrecio':
        return etiquetaGrandeSinPrecio;
      case 'etiquetaChiquitaSinPrecio':
        return etiquetaChiquitaSinPrecio;
      case 'etiquetaPrecioUnica':
        return etiquetaPrecioUnica;
      default:
        // Handle the case where localStorage.getItem('etiquetaZPL') is not recognized
        return null; // Or return a default label or handle the error as needed
    }
  }

  toggleInputMode(ev: any) {
    this.inputMode = ev.checked;
    if (this.inputMode == true) {
      this.textTeclado = 'Teclado Activado';
    } else {
      this.textTeclado = '¿Activar Teclado?';
    }
  }
}
