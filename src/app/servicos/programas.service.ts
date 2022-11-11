import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Programa } from '../modelos/programa';
import { Retorno } from '../modelos/retorno';

@Injectable({
  providedIn: 'root',
})
export class ProgramasService {
  _endpoint = environment.api_endpoint + '/programas';

  constructor(private http: HttpClient) {}

  retornarTodos() {
    return this.http.get<Retorno>(this._endpoint);
  }

  criar(nome: string): Observable<any> {
    var prog: Programa = { prog_id: 0, prog_nome: nome };
    return this.http.put(this._endpoint, prog);
  }

  atualizar(prog: Programa): Observable<any> {
    return this.http.patch(this._endpoint + '/' + prog.prog_id, prog);
  }

  excluir(prog: Programa): Observable<any> {
    return this.http.delete(this._endpoint + '/' + prog.prog_id, {
      body: { confirmado: 'S' },
    });
  }
}
