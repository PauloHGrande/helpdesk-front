import { Component } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent {

cliente: Cliente = {
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

  constructor(private service: ClienteService, 
              private toast: ToastrService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }            

  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe(resposta => {
      resposta.perfis = []
      this.cliente = resposta;
    })
  }

  update(): void {
    this.service.update(this.cliente).subscribe(resposta => {
      this.toast.success('Cliente atualizado com sucesso', 'Update');
      this.router.navigate(['clientes'])
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
    if(this.cliente.perfis.includes(perfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    } else {
      this.cliente.perfis.push(perfil);
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
