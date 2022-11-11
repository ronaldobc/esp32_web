import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Firmware } from '../modelos/firmware';
import { Programa } from '../modelos/programa';
import { FirmwareService } from '../servicos/firmware.service';
import { ProgramasService } from '../servicos/programas.service';

@Component({
  selector: 'app-firmware-lista',
  templateUrl: './firmware-lista.component.html',
  styleUrls: ['./firmware-lista.component.css'],
})
export class FirmwareListaComponent implements OnInit {
  programas: Programa[] = [];
  firmwares: Firmware[] = [];
  frmFirmware: FormGroup;
  modal!: NgbModalRef;
  editando?: Firmware;
  excluindo!: Firmware;
  programaAtual?: Programa;
  arquivo?: File;

  constructor(
    private progService: ProgramasService,
    private firmService: FirmwareService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.progService.retornarTodos().subscribe((ret) => {
      this.programas = ret.dados;
      if (this.programas.length > 0) {
        this.programaAtual = this.programas[0];
        this.atualizarFirmwares(this.programas[0].prog_id);
      }
    });
    this.frmFirmware = new FormGroup({
      nome: new FormControl(null, [Validators.required]),
      programa: new FormControl(null, [Validators.required]),
    });
  }

  trocarPrograma(prog_id: string) {
    this.programaAtual = this.programas.find(
      (p) => p.prog_id == Number.parseInt(prog_id)
    );
    this.atualizarFirmwares(Number.parseInt(prog_id));
  }

  atualizarFirmwares(prog_id: number) {
    this.firmService.retornarTodos(prog_id).subscribe(
      (ret) => {
        //console.log(ret);
        if (ret.erro == '') {
          this.firmwares = ret.dados;
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

  novo(conteudoModal: any) {
    this.modal = this.modalService.open(conteudoModal);
    this.editando = undefined;
    this.arquivo = undefined;
    this.frmFirmware.controls['programa'].disable();
    this.frmFirmware.setValue({
      nome: '',
      programa: this.programaAtual!.prog_id,
    });
  }

  editar(conteudoModal: any, firmware: Firmware) {
    this.modal = this.modalService.open(conteudoModal);
    this.editando = firmware;
    this.arquivo = undefined;
    this.frmFirmware.controls['programa'].disable();
    this.frmFirmware.setValue({
      nome: firmware.firm_nome,
      programa: firmware.prog_id,
    });
  }

  selecionarArquivo(evento: any) {
    this.arquivo = evento.target.files[0];
  }

  salvar() {
    //console.log(this.frmFirmware.value);
    if (this.editando == undefined) {
      var firmware: Firmware = {
        firm_id: 0,
        firm_nome: this.frmFirmware.value.nome,
        prog_id: this.programaAtual!.prog_id,
      };
      this.firmService.criar(firmware, this.arquivo).subscribe(
        (ret) => {
          console.log(ret);
          if (ret.erro == '') {
            this.modal.close();
            this.atualizarFirmwares(firmware.prog_id);
          } else {
            this.toastr.error(ret.erro);
          }
        },
        (erro) => {
          console.log(erro);
          this.toastr.error(erro);
        }
      );
    } else {
      var firmware: Firmware = {
        firm_id: this.editando.firm_id,
        firm_nome: this.frmFirmware.value.nome,
        prog_id: this.editando.prog_id,
      };
      this.firmService.atualizar(firmware, this.arquivo).subscribe(
        (ret) => {
          console.log(ret);
          if (ret.erro == '') {
            this.modal.close();
            this.atualizarFirmwares(this.editando!.prog_id);
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
  }

  confirmaExcluir(conteudoModal: any, firmware: Firmware) {
    this.modal = this.modalService.open(conteudoModal);
    this.excluindo = firmware;
  }

  excluir() {
    this.firmService.excluir(this.excluindo).subscribe(
      (ret) => {
        //console.log(ret);
        if (ret.erro == '') {
          this.modal.close();
          this.atualizarFirmwares(this.excluindo.prog_id);
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
