import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Firmware } from '../modelos/firmware';
import { Grupo } from '../modelos/grupo';
import { Programa } from '../modelos/programa';
import { FirmwareService } from '../servicos/firmware.service';
import { GruposService } from '../servicos/grupos.service';
import { ProgramasService } from '../servicos/programas.service';

@Component({
  selector: 'app-grupos-lista',
  templateUrl: './grupos-lista.component.html',
  styleUrls: ['./grupos-lista.component.css'],
})
export class GruposListaComponent implements OnInit {
  grupos: Grupo[] = [];
  programas: Programa[] = [];
  firmwares: Firmware[] = [];
  frmGrupo: FormGroup;
  modal!: NgbModalRef;
  editando?: Grupo;
  excluindo!: Grupo;
  programaAtual?: Programa;

  constructor(
    private grupoService: GruposService,
    private progService: ProgramasService,
    private firmService: FirmwareService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.progService.retornarTodos().subscribe((ret) => {
      this.programas = ret.dados;
      if (this.programas.length > 0) {
        this.programaAtual = this.programas[0];
        this.atualizarGrupos(this.programas[0].prog_id);
      }
    });
    this.frmGrupo = new FormGroup({
      nome: new FormControl(null, [Validators.required]),
      programa: new FormControl(null, [Validators.required]),
      firmware: new FormControl(),
    });
  }

  trocarPrograma(prog_id: string) {
    this.programaAtual = this.programas.find((p)=> p.prog_id == Number.parseInt(prog_id));
    this.atualizarGrupos(Number.parseInt(prog_id));
  }

  atualizarGrupos(prog_id: number) {
    this.grupoService.retornarTodos(prog_id).subscribe(
      (ret) => {
        //console.log(ret);
        if (ret.erro == '') {
          this.grupos = ret.dados;
        } else {
          this.toastr.error(ret.erro);
        }

        this.firmService.retornarTodos(prog_id).subscribe((firm) => {
          if (firm.erro == '') {
            this.firmwares = firm.dados;
          } else {
            this.toastr.error(ret.erro);
          }
        });
      },
      (erro) => console.log(erro)
    );
  }

  novo(conteudoModal: any) {
    this.modal = this.modalService.open(conteudoModal);
    this.editando = undefined;
    //this.frmGrupo.controls['nome'].enable();
    this.frmGrupo.controls['programa'].disable();
    this.frmGrupo.setValue({ nome: '', programa: this.programaAtual!.prog_id, firmware: 0 });
  }

  editar(conteudoModal: any, grupo: Grupo) {
    this.modal = this.modalService.open(conteudoModal);
    this.editando = grupo;
    this.frmGrupo.controls['programa'].disable();
    this.frmGrupo.setValue({
      nome: grupo.gru_nome,
      programa: grupo.prog_id,
      firmware: grupo.firm_id,
    });
  }

  salvar() {
    console.log(this.frmGrupo.value);
    if (this.editando == undefined) {
      var grupo: Grupo = {
        gru_id: 0,
        gru_nome: this.frmGrupo.value.nome,
        prog_id: this.programaAtual!.prog_id,
        firm_id: this.frmGrupo.value.firmware,
      };
        //console.log(grupo);
      this.grupoService.criar(grupo).subscribe(
        (ret) => {
          console.log(ret);
          if (ret.erro == '') {
            this.modal.close();
            this.atualizarGrupos(grupo.prog_id);
          } else {
            this.toastr.error(ret.erro);
          }
        },
        (erro) => console.log(erro)
      );
    } else {
      var grupo: Grupo = {
        gru_id: this.editando.gru_id,
        gru_nome: this.frmGrupo.value.nome,
        prog_id: this.editando.prog_id,
        firm_id: this.frmGrupo.value.firmware,
      };
      //console.log(grupo);
      this.grupoService.atualizar(grupo).subscribe(
        (ret) => {
          console.log(ret);
          if (ret.erro == '') {
            this.modal.close();
            this.atualizarGrupos(this.editando!.prog_id);
          } else {
            this.toastr.error(ret.erro);
          }
        },
        (erro) => console.log(erro)
      );
    }
  }

  confirmaExcluir(conteudoModal: any, grupo: Grupo) {
    this.modal = this.modalService.open(conteudoModal);
    this.excluindo = grupo;
  }

  excluir() {
    this.grupoService.excluir(this.excluindo).subscribe(
      (ret) => {
        console.log(ret);
        if (ret.erro == '') {
          this.modal.close();
          this.atualizarGrupos(this.excluindo.prog_id);
        } else {
          this.toastr.error(ret.erro);
        }
      },
      (erro) => console.log(erro)
    );
  }

  ngOnInit(): void {}
}
