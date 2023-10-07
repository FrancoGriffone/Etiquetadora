import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import { DialogEditImpresoraComponent } from './dialog-edit/dialog-edit-impresora.component';
import { DialogNuevaComponent } from './dialog-nueva/dialog-nueva.component';
import { Subscription } from 'rxjs';
import { NotifService } from 'src/app/services/notif.service';

@Component({
  selector: 'app-impresoras',
  templateUrl: './impresoras.component.html',
  styleUrls: ['./impresoras.component.scss'],
})
export class ImpresorasComponent implements OnInit {
  impresoras: any;

  //@ts-ignore
  private refrescarTabla: Subscription;

  constructor(
    private service: AppService,
    public dialog: MatDialog,
    public notif: NotifService
  ) {
    this.listarImpresoras();
  }

  ngOnInit(): void {
    this.refrescarTabla = this.notif.subscribeEvent<string>('refrescar', () => {
      this.listarImpresoras();
    });
  }

  listarImpresoras() {
    this.service.getImpresoras().subscribe((resp) => {
      this.impresoras = resp;
    });
  }

  seleccionado(ev: any) {
    this.dialog.open(DialogEditImpresoraComponent, {
      data: ev,
    });
  }

  nuevaImpresora() {
    this.dialog.open(DialogNuevaComponent, {});
  }
}
