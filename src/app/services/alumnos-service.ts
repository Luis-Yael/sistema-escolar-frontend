import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ValidatorService } from './tools/validator-service';
import { ErrorsService } from './tools/errors-service';
import { AlumnoApi, ErroresFormulario, RegistroAlumno } from '../interfaces/usuarios.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {

  private http = inject(HttpClient);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // Modelo vacío del formulario de registro
  public esquemaAlumno(): RegistroAlumno {
    return {
      rol: '',
      matricula: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      fecha_nacimiento: null,
      curp: '',
      rfc: '',
      edad: null,
      telefono: '',
      ocupacion: ''
    };
  }

  // Validación para el formulario
  public validarAlumno(data: RegistroAlumno, editar: boolean): ErroresFormulario {
    const error: ErroresFormulario = {};

    if (!this.validatorService.required(data['matricula'])) {
      error['matricula'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['first_name'])) {
      error['first_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['last_name'])) {
      error['last_name'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data['password'])) {
        error['password'] = this.errorService.required;
      }

      if (!this.validatorService.required(data['confirmar_password'])) {
        error['confirmar_password'] = this.errorService.required;
      } else if (data['password'] !== data['confirmar_password']) {
        error['confirmar_password'] = 'Las contraseñas no coinciden';
      }
    }

    if (!this.validatorService.required(data['fecha_nacimiento'])) {
      error['fecha_nacimiento'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['curp'])) {
      error['curp'] = this.errorService.required;
    } else if (data['curp'].length !== 18) {
      error['curp'] = 'La CURP debe tener 18 caracteres';
    }

    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
    }

    if (!this.validatorService.required(data['edad'])) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['edad'])) {
      error['edad'] = 'El formato es solo números';
    } else if (Number(data['edad']) < 15) {
      error['edad'] = 'La edad debe ser mayor o igual a 15';
    }

    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    }

    if (!this.validatorService.required(data['ocupacion'])) {
      error['ocupacion'] = this.errorService.required;
    }

    return error;
  }

  // El backend recibe la fecha de nacimiento como texto (YYYY-MM-DD) y no como Date
  public registrarAlumno(data: Omit<RegistroAlumno, 'fecha_nacimiento'> & { fecha_nacimiento: string }): Observable<unknown> {
    return this.http.post<unknown>(`${environment.url_api}/alumnos/`, data);
  }

  // Método para obtener la lista de alumnos desde la base de datos
  public obtenerListaAlumnos(): Observable<AlumnoApi[]> {
    return this.http.get<AlumnoApi[]>(`${environment.url_api}/lista-alumnos/`);
  }
}
