import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidacionRegistrosService {

  constructor() { }

  validationMessages = {
    email: [
      { type: 'required', message: 'Cédula de cliente es obligatorio' },
      { type: 'pattern', message: 'Digite solo números' },
      { type: 'minlength', message: 'Mínimo 10 dígitos' },
      { type: 'maxlength', message: 'Máximo 13 dígitos' },
    ],
    password: [
      { type: 'required', message: 'Contraseña es obligatorio.' },
      { type: 'minlength', message: 'Mínimo 5 caracteres' },
    ],
    cedula: [
      { type: 'required', message: 'Cédula es obligatorio.' },
      { type: 'pattern', message: 'Digite solo números' },
    ],       
    nombres: [
      { type: 'required', message: 'Nombres es obligatorio.' },
    ],   
    apellidos: [
      { type: 'required', message: 'Apellidos es obligatorio.' },
    ],         
    telefono: [
      { type: 'required', message: 'Teléfono es obligatorio.' },
      { type: 'pattern', message: 'Digite solo números' },
    ],         
    correo: [
      { type: 'required', message: 'Correo es obligatorio.' },
      { type: 'pattern', message: 'Correo incorrecto' },
    ],     
    direccion: [
      { type: 'required', message: 'Dirección es obligatorio.' },
    ], 
    username: [
      { type: 'required', message: 'Usuario es obligatorio.' },
    ],             
  };

}
