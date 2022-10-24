import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(private progService: ProgramasService, private modalService: NgbModal) {
    this.atualizarProgramas();
    this.frmPrograma = new FormGroup({
      nome: new FormControl(null, [Validators.required]),
    });
  }

  atualizarProgramas() {
    this.progService.retornarTodos().subscribe(
      (programas) => {
        console.log(programas);
        this.programas = programas;
      },
      (erro) => console.log(erro)
    );
  }

  novo(conteudoModal: any) {
    this.modal = this.modalService.open(conteudoModal);
    this.frmPrograma.setValue({"nome": ""});
  }

  salvar() {
    console.log(this.frmPrograma.value);
    this.progService.criar(this.frmPrograma.value.nome).subscribe(
      (retorno) => {
        console.log(retorno);
        this.modal.close();
        this.atualizarProgramas();
      },
      (erro) => console.log(erro)
    );
  }

  ngOnInit(): void {}
}
