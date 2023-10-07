import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EtiquetaResp } from '../models/etiqueta.resp';
import { ImpresorasResp } from '../models/impresoras-res';
import { ResDatos } from '../models/resdatos';
import { imprimirUSB } from '../models/imprimirUSB';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public codigo: any;
  public colaCodigos: string[] = [];

  constructor(private http: HttpClient) {}

  getDatos(id: string) {
    const url = 'http://192.168.0.9:100/api/productos/etiquetas/' + id;
    return this.http.get<ResDatos>(url);
  }

  postEtiqueta(values: Object) {
    const url = 'http://192.168.0.9:100/api/productos/etiquetas';
    const data = { ...values };
    return this.http.post(url, data);
  }

  addImpresora(values: any) {
    const url = 'http://192.168.0.9:100/api/productos/etiquetas/impresoras/app';
    const body = { ...values };
    return this.http.post(url, body);
  }

  getImpresoras() {
    const url = 'http://192.168.0.9:100/api/productos/etiquetas/impresoras/app';
    return this.http.get<ImpresorasResp>(url);
  }

  putImpresoras(values: any) {
    const url = 'http://192.168.0.9:100/api/productos/etiquetas/impresoras/app';
    const body = { ...values };
    return this.http.put<ImpresorasResp>(url, body);
  }

  getEtiquetas() {
    const url = 'http://192.168.0.9:100/api/productos/etiquetas/tipos';
    return this.http.get<EtiquetaResp>(url);
  }

  getLocales() {
    const url = 'http://192.168.0.9:100/api/productos/etiquetas/locales';
    return this.http.get<EtiquetaResp>(url);
  }

  controlEtiquetas(values: Object) {
    const url = 'http://192.168.0.9:100/api/productos/etiquetas/control';
    const body = { ...values };
    return this.http.post(url, body);
  }

  getDatosXLocal(codigo: string, local: any) {
    const url = `http://192.168.0.9:100/api/productos/etiquetas/${codigo}/${local}`;
    return this.http.get<ResDatos>(url);
  }

  imprimirZPL(etiqueta: any, printer: any) {
    const printerUrl = `http://${printer}/pstprnt`; // Asegúrate de tener el endpoint correcto

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(printerUrl, `^XA${etiqueta}^XZ`, {
      headers,
      responseType: 'text',
    });
  }

  imprimirUSB(ipPrinter: any, nombrePrinter: any, etiqueta: any) {
    const printerUrl = `http://${ipPrinter}:3000/imprimir?printer=${nombrePrinter}`;
    const body = `^XA${etiqueta}^XZ`;

    return this.http.post<imprimirUSB>(printerUrl, body).pipe(
      catchError((error) => {
        // Aquí manejas el error
        console.error('Error en la solicitud HTTP:', error.error.message);
        // Puedes mostrar un mensaje de error o realizar otras acciones aquí
        return throwError(error); // Reenvía el error para que otros puedan manejarlo
      })
    );
  }
}
