import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
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

  constructor() { }

  ngOnInit(): void {
  }

  validaCampos(): boolean {
    if(this.email.valid && this.senha.valid) {
      return true;
    }
    return false;
  }

}
