import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'src/app/services/app.service';
import { NotifService } from 'src/app/services/notif.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-edit-impresora',
  templateUrl: './dialog-edit-impresora.component.html',
  styleUrls: ['./dialog-edit-impresora.component.scss'],
})
export class DialogEditImpresoraComponent implements OnInit {
  durationInSeconds = 5;

  miFormulario: FormGroup = this.fb.group({
    id: [this.data.id, [Validators.required]],
    impresora: [
      this.data.impresora,
      [Validators.required, Validators.minLength(3)],
    ],
    descripcion: [
      this.data.descripcion,
      [Validators.required, Validators.minLength(3)],
    ],
    direccionIp: [
      this.data.direccionIp,
      [Validators.required, Validators.minLength(3)],
    ],
    usb: [this.data.usb],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: AppService,
    private _snackBar: MatSnackBar,
    private notif: NotifService,
    public dialogRef: MatDialogRef<DialogEditImpresoraComponent>
  ) {
    console.log(data);
  }
  ngOnInit(): void {}

  guardarCambios() {
    const obj = {
      id: this.miFormulario.value.id,
      impresora: this.miFormulario.value.impresora,
      descripcion: this.miFormulario.value.descripcion,
      direccionIp: this.miFormulario.value.direccionIp,
      usb: this.miFormulario.value.usb,
    };

    this.service.putImpresoras(obj).subscribe((resp) => {
      this.refrescarTabla();
      Swal.fire('¡Exito!', 'Cambios efectuados', 'success');
      this.dialogRef.close();
    });
  }

  refrescarTabla() {
    this.notif.sendEvent<String>('refrescar', '');
  }
}
