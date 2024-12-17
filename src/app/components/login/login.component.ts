import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Credenciais } from 'src/app/models/credenciais';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  creds: Credenciais = {
    email: '',
    senha: ''
  }
  
  email = new UntypedFormControl(null, Validators.email);
  senha = new UntypedFormControl(null, Validators.minLength(3));

  constructor(private toast: ToastrService) { }

  ngOnInit(): void {
  }

  logar() {
    this.toast.error('Usuário e/ou Senha inválidos!', 'Login');
    this.creds.senha = '';
  }

  validaCampos(): boolean {
    if(this.email.valid && this.senha.valid) {
      return true;
    }
    return false;
  }

}
