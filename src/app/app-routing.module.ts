import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionesComponent } from './components/configuraciones/configuraciones.component';
import { InputCodigoComponent } from './components/modelo-en-uso/input-codigo/input-codigo.component';
import { LectorCodigoComponent } from './components/modelo-viejo-sin-uso/lector-codigo/lector-codigo.component';
import { ImpresionComponent } from './components/modelo-viejo-sin-uso/impresion/impresion.component';
import { ModeloUpdComponent } from './components/modelo-upd/modelo-upd.component';
import { ImpresorasComponent } from './components/impresoras/impresoras.component';
import { MainComponent } from './components/main/main.component';
import { LabelaryComponent } from './components/labelary/labelary.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: '', // Ruta vacía
        redirectTo: 'scanner', // Redirige al child 'scanner'
        pathMatch: 'full', // Solo redirige cuando la URL es exactamente '/main'
      },
      {
        path: 'scanner',
        component: ModeloUpdComponent,
      },
      {
        path: 'scanner-upd',
        component: InputCodigoComponent,
      },
      {
        path: 'configuracion',
        component: ConfiguracionesComponent,
      },
      {
        path: 'impresoras',
        component: ImpresorasComponent,
      },
      {
        path: 'labelary',
        component: LabelaryComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'main',
  },
  // },
  // {
  //   path: 'configuracion',
  //   component: ConfiguracionesComponent,
  // },
  // {
  //   path: 'scanner-upd',
  //   component: InputCodigoComponent,
  // },
  // {
  //   path: 'scanner-viejo',
  //   component: LectorCodigoComponent,
  // },
  // {
  //   path: 'scanner',
  //   component: ModeloUpdComponent,
  // },
  // {
  //   path: 'impresion',
  //   component: ImpresionComponent,
  // },
  // {
  //   path: 'impresoras',
  //   component: ImpresorasComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
