import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Programa } from '../modelos/programa';
import { ProgramasService } from '../servicos/programas.service';

@Component({
  selector: 'app-programas-lista',
  templateUrl: './programas-lista.component.html',
  styleUrls: ['./programas-lista.component.css'],
})
export class ProgramasListaComponent implements OnInit {
  programas: Programa[] = [];
  frmPrograma: FormGroup;
  modal!: NgbModalRef;
  editando!: Programa;
  excluindo!: Programa;

  constructor(
    private progService: ProgramasService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.atualizarProgramas();
    this.frmPrograma = new FormGroup({
      nome: new FormControl(null, [Validators.required]),
    });
  }

  atualizarProgramas() {
    this.progService.retornarTodos().subscribe(
      (ret) => {
        console.log(ret);
        if (ret.erro == '') {
          this.programas = ret.dados;
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

  novo(conteudoModal: any) {
    this.modal = this.modalService.open(conteudoModal);
    this.frmPrograma.setValue({ nome: '' });
  }

  editar(conteudoModal: any, prog: Programa) {
    this.modal = this.modalService.open(conteudoModal);
    this.editando = prog;
    this.frmPrograma.setValue({ nome: prog.prog_nome });
  }

  salvar() {
    console.log(this.frmPrograma.value);
    if (this.editando == null) {
      this.progService.criar(this.frmPrograma.value.nome).subscribe(
        (ret) => {
          console.log(ret);
          if (ret.erro == '') {
            this.modal.close();
            this.atualizarProgramas();
          } else {
            this.toastr.error(ret.erro);
          }
        },
        (erro) => console.log(erro)
      );
    } else {
      this.editando.prog_nome = this.frmPrograma.value.nome;
      this.progService.atualizar(this.editando).subscribe(
        (ret) => {
          console.log(ret);
          if (ret.erro == '') {
            this.modal.close();
            this.atualizarProgramas();
          } else {
            this.toastr.error(ret.erro);
          }
        },
        (erro) => console.log(erro)
      );
    }
  }

  confirmaExcluir(conteudoModal: any, prog: Programa) {
    this.modal = this.modalService.open(conteudoModal);
    this.excluindo = prog;
  }

  excluir() {
    this.progService.excluir(this.excluindo).subscribe(
      (ret) => {
        console.log(ret);
        if (ret.erro == '') {
          this.modal.close();
          this.atualizarProgramas();
        } else {
          this.toastr.error(ret.erro);
        }
      },
      (erro) => console.log(erro)
    );
  }

  ngOnInit(): void {}
}
