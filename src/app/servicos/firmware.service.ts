import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Firmware } from '../modelos/firmware';
import { Retorno } from '../modelos/retorno';

@Injectable({
  providedIn: 'root',
})
export class FirmwareService {
  _endpoint = environment.api_endpoint + '/firmware';

  constructor(private http: HttpClient) {}

  retornarTodos(prog_id: number) {
    return this.http.get<Retorno>(this._endpoint + "/" + prog_id);
  }

  criar(firmware: Firmware): Observable<any> {
    return this.http.put(this._endpoint, firmware);
  }

  atualizar(firmware: Firmware): Observable<any> {
    return this.http.patch(this._endpoint + '/' + firmware.firm_id, firmware);
  }

  excluir(firmware: Firmware): Observable<any> {
    return this.http.delete(this._endpoint + '/' + firmware.firm_id, {
      body: { confirmado: 'S' },
    });
  }
}
