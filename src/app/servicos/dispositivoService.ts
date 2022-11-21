import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Dispositivo } from '../modelos/dispositivo';
import { Firmware } from '../modelos/firmware';
import { Retorno } from '../modelos/retorno';

@Injectable({
  providedIn: 'root',
})
export class DispositivoService {
  _endpoint = environment.api_endpoint + '/disp';

  constructor(private http: HttpClient) {}

  retornarTodos(gru_id: number) {
    return this.http.get<Retorno>(this._endpoint + "/" + gru_id);
  }

  atualizar(dispositivo: Dispositivo): Observable<any> {
    return this.http.patch(this._endpoint + '/' + dispositivo.disp_id, dispositivo);
  }

  excluir(dispositivo: Dispositivo): Observable<any> {
    return this.http.delete(this._endpoint + '/' + dispositivo.disp_id, {
      body: { confirmado: 'S' },
    });
  }

}
