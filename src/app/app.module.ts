import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { ImpresionComponent } from './components/modelo-viejo-sin-uso/impresion/impresion.component';
import { NgxPrintModule } from 'ngx-print';
import { NgxBarcodeModule } from 'ngx-barcode';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { LectorCodigoComponent } from './components/modelo-viejo-sin-uso/lector-codigo/lector-codigo.component';
import { InputCodigoComponent } from './components/modelo-en-uso/input-codigo/input-codigo.component';
import { SpinnerInterceptor } from './shared/interceptors/spinner.interceptors';
import { SpinnerModule } from './shared/spinner/spinner.module';
import { ConfiguracionesComponent } from './components/configuraciones/configuraciones.component';
import { ConfigImpresoraComponent } from './components/configuraciones/config-impresora/config-impresora.component';
import { ConfigEtiquetaComponent } from './components/configuraciones/config-etiqueta/config-etiqueta.component';
import { ConfigLocalComponent } from './components/configuraciones/config-local/config-local.component';
import { ModeloUpdComponent } from './components/modelo-upd/modelo-upd.component';
import { ConfigEtiquetaZPLComponent } from './components/configuraciones/config.etiqueta-ZPL/config-etiqueta-zpl.component';
import { ImpresorasComponent } from './components/impresoras/impresoras.component';
import { DialogEditImpresoraComponent } from './components/impresoras/dialog-edit/dialog-edit-impresora.component';
import { DialogNuevaComponent } from './components/impresoras/dialog-nueva/dialog-nueva.component';
import { MainComponent } from './components/main/main.component';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LabelaryComponent } from './components/labelary/labelary.component';

@NgModule({
  declarations: [
    AppComponent,
    LectorCodigoComponent,
    ImpresionComponent,
    InputCodigoComponent,
    ConfiguracionesComponent,
    ConfigImpresoraComponent,
    ConfigEtiquetaComponent,
    ConfigLocalComponent,
    ModeloUpdComponent,
    ConfigEtiquetaZPLComponent,
    ImpresorasComponent,
    DialogEditImpresoraComponent,
    DialogNuevaComponent,
    MainComponent,
    LabelaryComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxPrintModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBarcodeModule,
    SpinnerModule,

    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSlideToggleModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
