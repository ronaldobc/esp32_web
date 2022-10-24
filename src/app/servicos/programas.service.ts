import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Programa } from '../modelos/programa';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {

  _endpoint =  environment.api_endpoint + '/programas';

  constructor(private http: HttpClient) { 
    
  }

  retornarTodos() {
    return this.http.get<Programa[]>(this._endpoint);
  }

  criar(nome: string): Observable<any> {
    var prog: Programa = {prog_id: 0, prog_nome: nome};
    return this.http.put(this._endpoint, prog);
  }
}
