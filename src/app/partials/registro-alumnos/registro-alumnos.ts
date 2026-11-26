import { Component, inject, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AlumnosService } from '../../services/alumnos-service';
import { NotificationService } from '../../services/tools/notification-service';
import { DatosAlumno, ErroresFormulario, RegistroAlumno } from '../../interfaces/usuarios.interfaces';
import { mensajeError } from '../../shared/mensaje-error';

@Component({
  selector: 'app-registro-alumnos',
  imports: [...SHARED_IMPORTS],
  providers: [provideNativeDateAdapter()],
  templateUrl: './registro-alumnos.html',
  styleUrl: './registro-alumnos.scss',
})
export class RegistroAlumnos implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosAlumno = {} as DatosAlumno;

  private location = inject(Location);
  private alumnosService = inject(AlumnosService);
  private notificationService = inject(NotificationService);

  public alumno: RegistroAlumno = this.alumnosService.esquemaAlumno();
  public errors: ErroresFormulario = {};
  public editar: boolean = false;
  public enviando: boolean = false;

  // Variables para el campo de contraseña
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  // Fecha que muestra el datepicker; el valor que se envía se guarda en alumno.fecha_nacimiento
  public fechaVisual: Date | null = null;

  ngOnInit(): void {
    this.alumno.rol = this.rol || 'alumno';
  }

  public regresar(): void {
    this.location.back();
  }

  public showPassword(): void {
    this.inputType_1 = this.hide_1 ? 'password' : 'text';
    this.hide_1 = !this.hide_1;
  }

  public showPwdConfirmar(): void {
    this.inputType_2 = this.hide_2 ? 'password' : 'text';
    this.hide_2 = !this.hide_2;
  }

  public registrar(): void {
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // El backend espera la fecha como YYYY-MM-DD; la validación garantiza que no es nula
    const data = {
      ...this.alumno,
      rol: this.rol || 'alumno',
      fecha_nacimiento: this.formatearFecha(this.alumno.fecha_nacimiento as Date),
    };

    this.enviando = true;
    this.alumnosService.registrarAlumno(data).subscribe({
      next: () => {
        this.enviando = false;
        this.notificationService.success('Alumno registrado correctamente');
        this.regresar();
      },
      error: (error) => {
        this.enviando = false;
        this.notificationService.error(mensajeError(error, 'Error al registrar el alumno'));
      }
    });
  }

  public actualizar(): void {}

  // Se ejecuta al elegir una fecha en el calendario o al escribirla en el campo
  public changeFecha(event: MatDatepickerInputEvent<Date>): void {
    this.alumno.fecha_nacimiento = event.value;
  }

  public soloLetras(event: KeyboardEvent): void {
    // Permite letras, incluidas las acentuadas y la ñ, y espacios
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  private formatearFecha(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}
