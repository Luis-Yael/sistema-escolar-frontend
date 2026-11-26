import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator-service';
import { ErrorsService } from './tools/errors-service';
import { ErroresFormulario, MaestroApi, RegistroMaestro } from '../interfaces/usuarios.interfaces';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {

  private http = inject(HttpClient);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // Modelo vacío del formulario de registro
  public esquemaMaestro(): RegistroMaestro {
    return {
      rol: '',
      id_trabajador: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: null,
      telefono: '',
      rfc: '',
      cubiculo: '',
      area_investigacion: '',
      materias_array: []
    };
  }

  //Validación para el formulario
  public validarMaestro(data: RegistroMaestro, editar: boolean): ErroresFormulario {
    const error: ErroresFormulario = {};

    if(!this.validatorService.required(data["id_trabajador"])){
      error["id_trabajador"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.max(data["email"], 40)){
      error["email"] = this.errorService.max(40);
    }else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if(!editar){
      if(!this.validatorService.required(data["password"])){
        error["password"] = this.errorService.required;
      }

      if(!this.validatorService.required(data["confirmar_password"])){
        error["confirmar_password"] = this.errorService.required;
      }else if(data["password"] !== data["confirmar_password"]){
        error["confirmar_password"] = "Las contraseñas no coinciden";
      }
    }

    if(!this.validatorService.required(data["fecha_nacimiento"])){
      error["fecha_nacimiento"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["rfc"])){
      error["rfc"] = this.errorService.required;
    }else if(!this.validatorService.min(data["rfc"], 12)){
      error["rfc"] = this.errorService.min(12);
    }else if(!this.validatorService.max(data["rfc"], 13)){
      error["rfc"] = this.errorService.max(13);
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["cubiculo"])){
      error["cubiculo"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["area_investigacion"])){
      error["area_investigacion"] = this.errorService.required;
    }

    if(!Array.isArray(data["materias_array"]) || data["materias_array"].length === 0){
      error["materias_array"] = "Debes seleccionar materias para poder registrarte";
    }
    //Return arreglo
    return error;
  }

  // El backend recibe la fecha de nacimiento como texto (YYYY-MM-DD) y no como Date
  public registrarMaestro(data: Omit<RegistroMaestro, 'fecha_nacimiento'> & { fecha_nacimiento: string }): Observable<unknown> {
    return this.http.post<unknown>(`${environment.url_api}/maestros/`, data);
  }

  // Método para obtener la lista de maestros desde la base de datos
  public obtenerListaMaestros(): Observable<MaestroApi[]> {
    // Llamada al endpoint de la API directamente en el return para obtener la lista de maestros
    return this.http.get<MaestroApi[]>(`${environment.url_api}/lista-maestros/`);
  }
}
