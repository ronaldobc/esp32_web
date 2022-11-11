import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Grupo } from '../modelos/grupo';
import { Programa } from '../modelos/programa';
import { Retorno } from '../modelos/retorno';

@Injectable({
  providedIn: 'root',
})
export class GruposService {
  _endpoint = environment.api_endpoint + '/grupos';

  constructor(private http: HttpClient) {}

  retornarTodos(prog_id: number) {
    return this.http.get<Retorno>(this._endpoint + "/" + prog_id);
  }

  criar(grupo: Grupo): Observable<any> {
    return this.http.put(this._endpoint, grupo);
  }

  atualizar(grupo: Grupo): Observable<any> {
    return this.http.patch(this._endpoint + '/' + grupo.gru_id, grupo);
  }

  excluir(grupo: Grupo): Observable<any> {
    return this.http.delete(this._endpoint + '/' + grupo.gru_id, {
      body: { confirmado: 'S' },
    });
  }
}
