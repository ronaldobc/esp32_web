import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirmwareListaComponent } from './firmware-lista/firmware-lista.component';
import { GruposListaComponent } from './grupos-lista/grupos-lista.component';
import { ProgramasListaComponent } from './programas-lista/programas-lista.component';

const routes: Routes = [
  {path: '', redirectTo: 'programas', pathMatch: 'full' },
  {path: 'programas', component: ProgramasListaComponent },
  {path: 'grupos', component: GruposListaComponent },
  {path: 'dispositivos', component: ProgramasListaComponent },
  {path: 'firmwares', component: FirmwareListaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
