import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProgramasListaComponent } from './programas-lista/programas-lista.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { GruposListaComponent } from './grupos-lista/grupos-lista.component';

@NgModule({
  declarations: [
    AppComponent,
    ProgramasListaComponent,
    GruposListaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastNoAnimationModule.forRoot(),
    NgbModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
