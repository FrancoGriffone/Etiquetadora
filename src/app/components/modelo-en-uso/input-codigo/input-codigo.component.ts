import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-input-codigo',
  templateUrl: './input-codigo.component.html',
  styleUrls: ['./input-codigo.component.scss'],
})
export class InputCodigoComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    codigo: ['', [Validators.required, Validators.minLength(3)]],
  });
  @ViewChild('inputCodigo', { static: false }) inputCodigo: any = ElementRef;

  /* CONFIGURACION DE LA COLA DE IMPRESION */
  QUEUE_INTERVAL = 50;

  isError = 'null';
  nombreImpresora: any;
  nombreEtiqueta: any;
  nombreLocal: any;
  showError: boolean = false;
  inputMode: boolean = false;
  textTeclado: string = '¿Activar Teclado?';

  constructor(
    private fb: FormBuilder,
    public service: AppService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setInterval(this.queueWorker.bind(this), this.QUEUE_INTERVAL);
    this.service.getImpresoras().subscribe((resp) => {
      const respuesta = resp;
      this.nombreImpresora = respuesta
        .filter((x: any) => x.id == localStorage.getItem('impresora'))
        .map((e: any) => e.descripcion);
    });
    this.service.getEtiquetas().subscribe((resp) => {
      const respuesta = resp;
      this.nombreEtiqueta = respuesta
        .filter((x: any) => x.id == localStorage.getItem('etiqueta'))
        .map((e: any) => e.tipoEtiqueta);
    });
    this.service.getLocales().subscribe((resp) => {
      const respuesta = resp;
      this.nombreLocal = respuesta
        .filter((x: any) => x.id == localStorage.getItem('local'))
        .map((e: any) => e.local);
    });
  }

  mandarCodigo(codigo: any) {
    const obj = {
      codigo: codigo,
      idImpresora: localStorage.getItem('impresora'),
      idTipo: localStorage.getItem('etiqueta'),
      local: localStorage.getItem('local'),
    };

    console.log(obj);

    this.service.postEtiqueta(obj).subscribe(
      (resp) => {
        this.showError = true;
        {
          this.isError = 'SUCCESS';
          setTimeout(() => {
            this.showError = false;
            this.isError = 'PENDING';
          }, 2000);
        }
      },
      (error) => {
        {
          this.showError = true;
          this.isError = 'ERROR';
          setTimeout(() => {
            this.showError = false;
            this.isError = 'PENDING';
          }, 2000);
        }
      }
    );
  }

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
    //if (this.QUEUE_BUSY) return console.log('QUEUE WORKER IS BUSY');

    if (this.service.colaCodigos.length > 0) {
      console.log('START - TAMAÑO DE COLA', this.service.colaCodigos.length);
      const codigo = this.service.colaCodigos.shift();
      this.mandarCodigo(codigo);
      console.log('END - TAMAÑO DE COLA', this.service.colaCodigos.length);
    } //else console.log('NO HAY ELEMENTOS EN LA COLA.');
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

  irConfiguraciones() {
    this.router.navigate(['/configuracion']);
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
