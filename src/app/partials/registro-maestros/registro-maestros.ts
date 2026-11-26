import { Component, inject, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MaestrosService } from '../../services/maestros-service';
import { NotificationService } from '../../services/tools/notification-service';
import { mensajeError } from '../../shared/mensaje-error';
import { DatosMaestro, ErroresFormulario, RegistroMaestro } from '../../interfaces/usuarios.interfaces';

@Component({
  selector: 'app-registro-maestros',
  imports: [...SHARED_IMPORTS],
  providers: [provideNativeDateAdapter()],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss',
})
export class RegistroMaestros implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: DatosMaestro = {} as DatosMaestro;

  private location = inject(Location);
  private maestrosService = inject(MaestrosService);
  private notificationService = inject(NotificationService);

  public maestro: RegistroMaestro = this.maestrosService.esquemaMaestro();
  public errors: ErroresFormulario = {};
  public editar: boolean = false;

  // Variables para el campo de contraseña
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  // La fecha de nacimiento no puede ser futura
  public maxDate: Date = new Date();

  public areas_investigacion: string[] = [
    'Desarrollo Web',
    'Programación',
    'Bases de datos',
    'Redes',
    'Matemáticas'
  ];

  public materias: string[] = [
    'Aplicaciones Web',
    'Programación 1',
    'Bases de datos',
    'Tecnologías Web',
    'Minería de datos',
    'Desarrollo móvil',
    'Estructuras de datos',
    'Administración de redes',
    'Ingeniería de Software',
    'Administración de S.O.'
  ];

  ngOnInit(): void {
    this.maestro.rol = this.rol || 'maestro';
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
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // El backend espera la fecha como YYYY-MM-DD; la validación garantiza que no es nula
    const data = {
      ...this.maestro,
      rol: this.rol || 'maestro',
      fecha_nacimiento: this.formatearFecha(this.maestro.fecha_nacimiento as Date),
    };

    this.maestrosService.registrarMaestro(data).subscribe({
      next: () => {
        this.notificationService.success('Maestro registrado correctamente');
        this.regresar();
      },
      error: (error) => {
        this.notificationService.error(mensajeError(error, 'Error al registrar el maestro'));
      }
    });
  }

  public actualizar(): void {}

  // Agrega o quita una materia de la lista seleccionada
  public checkboxChange(event: { checked: boolean }, materia: string): void {
    if (event.checked) {
      this.maestro.materias_array.push(materia);
    } else {
      this.maestro.materias_array = this.maestro.materias_array.filter((m: string) => m !== materia);
    }
  }

  public revisarSeleccion(materia: string): boolean {
    return this.maestro.materias_array?.includes(materia) ?? false;
  }

  public soloLetras(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }

  private formatearFecha(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}
