import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import { ImpresionComponent } from '../impresion/impresion.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lector-codigo',
  templateUrl: './lector-codigo.component.html',
  styleUrls: ['./lector-codigo.component.scss'],
})
export class LectorCodigoComponent implements OnInit {
  widthBarcode = 1.4;
  heightBarcode = 40;
  datos: any = {};

  miFormulario: FormGroup = this.fb.group({
    codigo: ['0002850990060', [Validators.required, Validators.minLength(3)]],
  });

  /* CONFIGURACION DE LA COLA DE IMPRESION */
  QUEUE_INTERVAL = 50;
  QUEUE_BUSY = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public service: AppService,
    public router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const codigo = this.router.snapshot.queryParamMap.get('codigo');

    if (codigo) {
      console.log('GOT CODE', codigo);
      this.service.getDatos(codigo as string).subscribe((resp) => {
        this.datos = resp[0];

        setTimeout(() => {
          //@ts-ignore
          document.getElementById('submitButton').click();

          this.QUEUE_BUSY = false;
        }, 100);
      });
    }

    setInterval(this.queueWorker.bind(this), this.QUEUE_INTERVAL);
  }

  // Enviar codigo a la cola
  mandarCodigo() {
    // this.service.codigo = this.miFormulario.value.codigo;
    const value = this.miFormulario.value.codigo;
    console.log('AGREGANDO EL CODIGO ', value, 'A LA COLA DE IMPRESION');

    this.service.colaCodigos.push(value);

    this.miFormulario.patchValue({
      codigo: null,
    });
  }

  // Procesar cola actual
  queueWorker() {
    //if (this.QUEUE_BUSY) return console.log('QUEUE WORKER IS BUSY');

    if (this.service.colaCodigos.length > 0) {
      this.QUEUE_BUSY = true;
      console.log('START - TAMAÑO DE COLA', this.service.colaCodigos.length);
      const codigo = this.service.colaCodigos.pop();
      console.log('PROCESANDO CODIGO ', codigo);
      console.log('END - TAMAÑO DE COLA', this.service.colaCodigos.length);
      window.open(`/#/scanner?codigo=${codigo}`, '_blank');
    } //else console.log('NO HAY ELEMENTOS EN LA COLA.');
  }

  llenarDatos() {
    this.service
      .imprimirZPL('1234', 'ACA VA LA INMPRESORA')
      .subscribe((resp) => {
        console.log(resp);
      });
  }
}
