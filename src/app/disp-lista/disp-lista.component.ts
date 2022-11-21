import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Dispositivo } from '../modelos/dispositivo';
import { Grupo } from '../modelos/grupo';
import { DispositivoService } from '../servicos/dispositivoService';
import { GruposService } from '../servicos/grupos.service';

@Component({
  selector: 'app-dispositivo-lista',
  templateUrl: './disp-lista.component.html',
  styleUrls: ['./disp-lista.component.css'],
})
export class DispositivoListaComponent implements OnInit {
  grupos: Grupo[] = [];
  gruposEditar: Grupo[] = [];
  dispositivos: Dispositivo[] = [];
  frmDisp: FormGroup;
  modal!: NgbModalRef;
  editando?: Dispositivo;
  excluindo!: Dispositivo;
  grupoAtual?: Grupo;

  constructor(
    private grupoService: GruposService,
    private dispService: DispositivoService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.grupoService.retornarTodos(0).subscribe((ret) => {
      this.grupos = ret.dados;
      if (this.grupos.length > 0) {
        this.grupoAtual = this.grupos[0];
        this.atualizarDispositivos(this.grupos[0].gru_id);
      }
    });
    this.frmDisp = new FormGroup({
      status: new FormControl(null, [Validators.required]),
      grupo: new FormControl(null, [Validators.required]),
    });
  }

  trocarGrupo(gru_id: string) {
    this.grupoAtual = this.grupos.find(
      (g) => g.gru_id == Number.parseInt(gru_id)
    );
    this.atualizarDispositivos(Number.parseInt(gru_id));
  }

  atualizarDispositivos(gru_id: number) {
    this.dispService.retornarTodos(gru_id).subscribe(
      (ret) => {
        //console.log(ret);
        if (ret.erro == '') {
          this.dispositivos = ret.dados;
        } else {
          this.toastr.error(ret.erro);
        }
      },
      (erro) => {
        console.log(erro);
        this.toastr.error(erro);
      }
    );
  }

  editar(conteudoModal: any, dispositivo: Dispositivo) {
    this.modal = this.modalService.open(conteudoModal);
    this.editando = dispositivo;
    this.gruposEditar = this.grupos.filter((g) => g.prog_id == this.editando!.prog_id);
    this.frmDisp.setValue({
      status: dispositivo.disp_status,
      grupo: dispositivo.gru_id,
    });
  }

  salvar() {
    //console.log(this.frmFirmware.value);
    var dispositivo: Dispositivo = {
      disp_id: this.editando!.disp_id,
      disp_chip: this.editando!.disp_chip,
      disp_nome: this.editando!.disp_nome,
      disp_status: this.frmDisp.value.status,
      gru_id: this.frmDisp.value.grupo,
    };
    this.dispService.atualizar(dispositivo).subscribe(
      (ret) => {
        console.log(ret);
        if (ret.erro == '') {
          this.modal.close();
          this.atualizarDispositivos(this.editando!.gru_id);
        } else {
          this.toastr.error(ret.erro);
        }
      },
      (erro) => {
        console.log(erro);
        this.toastr.error(erro.message);
      }
    );
  }

  confirmaExcluir(conteudoModal: any, dispositivo: Dispositivo) {
    this.modal = this.modalService.open(conteudoModal);
    this.excluindo = dispositivo;
  }

  traduzStatus(status: string) {
    if (status == 'A') {
      return 'Ativo';
    } else if (status == 'N') {
      return 'Novo';
    } else if (status == 'B') {
      return 'Bloqueado';
    } else {
      return '';
    }
  }

  excluir() {
    this.dispService.excluir(this.excluindo).subscribe(
      (ret) => {
        //console.log(ret);
        if (ret.erro == '') {
          this.modal.close();
          this.atualizarDispositivos(this.excluindo.disp_id);
        } else {
          this.toastr.error(ret.erro);
        }
      },
      (erro) => {
        console.log(erro);
        this.toastr.error(erro);
      }
    );
  }

  ngOnInit(): void {}
}
