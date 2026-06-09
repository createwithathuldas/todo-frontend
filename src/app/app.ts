import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './Services/auth-service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Todo-frontend');
  private readonly authService = inject(AuthService);

  isAuthenticated$ = this.authService.user$;

  logout(): void {
    this.authService.logout();
  }
}
