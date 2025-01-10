import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent {

tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  nome: FormControl = new FormControl(null, [Validators.minLength(3), Validators.maxLength(50)]);
  cpf: FormControl = new FormControl(null, [Validators.required, this.isValidCpf()]);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(private service: TecnicoService, 
              private toast: ToastrService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }            

  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      resposta.perfis = []
      this.tecnico = resposta;
    })
  }

  update(): void {
    this.service.update(this.tecnico).subscribe(resposta => {
      this.toast.success('Técnico atualizado com sucesso', 'Update');
      this.router.navigate(['tecnicos'])
    }, ex => {
      console.log(ex);
      if(ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(ex.error.message);
      }
    })
  }

  addPerfil(perfil: any): void {
    if(this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
  }

  isValidCpf() {
        return (control: AbstractControl): Validators => {
          const cpf = control.value;
          if (cpf) {
            let numbers, digits, sum, i, result, equalDigits;
            equalDigits = 1;
            if (cpf.length < 11) {
            return null;
            }
  
            for (i = 0; i < cpf.length - 1; i++) {
              if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
                equalDigits = 0;
                break;
              }
            }
  
            if (!equalDigits) {
              numbers = cpf.substring(0, 9);
              digits = cpf.substring(9);
              sum = 0;
              for (i = 10; i > 1; i--) {
                sum += numbers.charAt(10 - i) * i;
              }
  
              result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
              if (result !== Number(digits.charAt(0))) {
                return { cpfNotValid: true };
              }
              numbers = cpf.substring(0, 10);
              sum = 0;
  
              for (i = 11; i > 1; i--) {
                sum += numbers.charAt(11 - i) * i;
              }
              result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
              if (result !== Number(digits.charAt(1))) {
                return { cpfNotValid: true };
              }
              return null;
            } else {
              return { cpfNotValid: true };
            }
        }
      return null;
    } 
  }
}
