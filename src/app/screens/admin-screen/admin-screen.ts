import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { AdministradoresService } from '../../services/administradores-service';
import { NotificationService } from '../../services/tools/notification-service';

@Component({
  selector: 'app-admin-screen',
  imports: [],
  templateUrl: './admin-screen.html',
  styleUrl: './admin-screen.scss',
})
export class AdminScreen implements OnInit {
  private authService = inject(AuthService);
  private administradoresService = inject(AdministradoresService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  public name_user: string = '';
  // Lista de administradores y bandera de carga como signals: el template se actualiza al cambiar su valor
  public lista_admins = signal<any[]>([]);
  public cargando = signal<boolean>(false);

  ngOnInit(): void {
    // El nombre se toma de la cookie de sesión guardada al iniciar sesión
    this.name_user = this.authService.getUserCompleteName();
    // Se obtiene la lista de administradores al cargar la pantalla
    this.obtenerAdmins();
  }

  // Obtiene la lista de administradores y actualiza los signals que lee el template
  public obtenerAdmins(): void {
    this.cargando.set(true);
    this.administradoresService.obtenerListaAdmins().pipe(
      finalize(() => this.cargando.set(false))
    ).subscribe({
      next: (response) => {
        this.lista_admins.set(response);
        console.log('Lista de administradores:', this.lista_admins());
      },
      error: () => this.notificationService.error('No se pudo obtener la lista de administradores'),
    });
  }

  // Redirige al formulario de registro en modo edición para el administrador seleccionado
  public goEditar(idUser: number): void {
    this.router.navigate(['registro-usuarios', 'administrador', idUser]);
  }

  public delete(idUser: number): void {
    // Pendiente: confirmar y llamar al servicio de eliminación
    console.log('Eliminar administrador', idUser);
  }
}
