import { Component, inject, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AuthService } from '../../services/auth-service';
import { AdminScreen } from '../admin-screen/admin-screen';
import { AlumnosScreen } from '../alumnos-screen/alumnos-screen';
import { MaestrosScreen } from '../maestros-screen/maestros-screen';

@Component({
  selector: 'app-home-screen',
  imports: [
    ...SHARED_IMPORTS,
    AdminScreen,
    AlumnosScreen,
    MaestrosScreen,
  ],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss',
})
export class HomeScreen implements OnInit {
  private authService = inject(AuthService);

  // Rol del usuario en sesión, usado en el template para decidir qué home mostrar
  public rol: string = '';

  ngOnInit(): void {
    this.rol = this.authService.getUserRole();
  }
}
