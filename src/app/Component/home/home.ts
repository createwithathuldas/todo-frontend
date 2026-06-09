import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../Services/auth-service';
import { TodoService } from '../../Services/todo-service';
import { Todo } from '../../models/todo.model';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);

  currentUser: any = null;
  todos: Todo[] = [];
  newTaskTitle = '';
  loading = false;
  error: string | null = null;

  currentPage = 1;
  pageSize = 6;

  private authSubscription: Subscription | null = null;

  private readonly dummyTasks: Todo[] = [
    { id: 1, task: 'Task One', userName: 'Guest', createdAt: new Date().toISOString(), isCompleted: false, completedAt: '' },
    { id: 2, task: 'Task Two', userName: 'Guest', createdAt: new Date().toISOString(), isCompleted: true, completedAt: new Date().toISOString() },
    { id: 3, task: 'Task Three', userName: 'Guest', createdAt: new Date().toISOString(), isCompleted: false, completedAt: '' },
    { id: 4, task: 'Task Four', userName: 'Guest', createdAt: new Date().toISOString(), isCompleted: false, completedAt: '' },
    { id: 5, task: 'Task Five', userName: 'Guest', createdAt: new Date().toISOString(), isCompleted: true, completedAt: new Date().toISOString() },
    { id: 6, task: 'Task Six', userName: 'Guest', createdAt: new Date().toISOString(), isCompleted: false, completedAt: '' },
    { id: 7, task: 'Task Seven (Next Page)', userName: 'Guest', createdAt: new Date().toISOString(), isCompleted: false, completedAt: '' }
  ];

  ngOnInit(): void {
    this.authSubscription = this.authService.user$.subscribe({
      next: (user) => {
        this.currentUser = user;
        this.currentPage = 1;
        if (user) {
          this.loadTodos();
        } else {
          this.todos = [...this.dummyTasks];
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  loadTodos(): void {
    this.loading = true;
    this.error = null;

    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load tasks.';
        this.loading = false;
      }
    });
  }

  addTask(): void {
    if (!this.currentUser) return;
    const task = this.newTaskTitle.trim();
    if (!task) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.todoService.createTodo(task).subscribe({
      next: (newTodo) => {
        this.todos = [newTodo, ...this.todos];
        this.newTaskTitle = '';
        this.loading = false;
        this.currentPage = 1;
      },
      error: () => {
        this.error = 'Failed to add new task.';
        this.loading = false;
      }
    });
  }

  markAsDone(todo: Todo): void {
    if (!this.currentUser) return;
    this.loading = true;
    this.error = null;

    this.todoService.toggleComplete(todo).subscribe({
      next: (updatedTodo) => {
        this.todos = this.todos.map((t) =>
          t.id === updatedTodo.id ? updatedTodo : t
        );
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to update task status.';
        this.loading = false;
      }
    });
  }

  deleteTask(id: number): void {
    if (!this.currentUser) return;
    this.loading = true;
    this.error = null;

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter((t) => t.id !== id);
        this.loading = false;
        const maxPage = Math.ceil(this.todos.length / this.pageSize) || 1;
        if (this.currentPage > maxPage) {
          this.currentPage = maxPage;
        }
      },
      error: () => {
        this.error = 'Failed to delete task.';
        this.loading = false;
      }
    });
  }

  trackById(index: number, todo: Todo): number {
    return todo.id;
  }

  getPaginatedTodos(): Todo[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.todos.slice(startIndex, startIndex + this.pageSize);
  }

  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.todos.length / this.pageSize);
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }
    return pages;
  }

  setPage(page: number): void {
    this.currentPage = page;
  }
}
