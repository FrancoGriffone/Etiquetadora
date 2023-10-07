import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import { NotifService } from 'src/app/services/notif.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-nueva',
  templateUrl: './dialog-nueva.component.html',
  styleUrls: ['./dialog-nueva.component.scss'],
})
export class DialogNuevaComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    impresora: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    direccionIp: ['', [Validators.required, Validators.minLength(3)]],
    usb: [false],
  });
  constructor(
    private fb: FormBuilder,
    private service: AppService,
    private notif: NotifService,
    public dialogRef: MatDialogRef<DialogNuevaComponent>
  ) {}

  ngOnInit(): void {}

  nuevaImpresora() {
    const obj = {
      impresora: this.miFormulario.value.impresora,
      descripcion: this.miFormulario.value.descripcion,
      direccionIp: this.miFormulario.value.direccionIp,
      usb: this.miFormulario.value.usb,
    };

    this.service.addImpresora(obj).subscribe((resp) => {
      this.refrescarTabla();
      Swal.fire('¡Exito!', 'Impresora agregada', 'success');
      this.dialogRef.close();
    });
  }

  refrescarTabla() {
    this.notif.sendEvent<String>('refrescar', '');
  }
}
