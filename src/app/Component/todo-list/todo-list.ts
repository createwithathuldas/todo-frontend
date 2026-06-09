import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoService } from '../../Services/todo-service';
import { Todo } from '../../models/todo.model';

@Component({
  standalone: true,
  selector: 'app-todo-list',
  imports: [CommonModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css']
})
export class TodoList {
  private readonly todoService = inject(TodoService);

  todos = [] as Todo[];
  loading = false;
  error: string | null = null;
  newTask = '';

  constructor() {
    this.loadTodos();
  }

  private handleError(message: string) {
    this.error = message;
    this.loading = false;
  }

  loadTodos(): void {
    this.loading = true;
    this.error = null;

    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: () => this.handleError('Could not load todo items. Please try again.')
    });
  }

  addTodo(): void {
    const task = this.newTask.trim();
    if (!task) {
      return;
    }

    this.loading = true;
    this.todoService.createTodo(task).subscribe({
      next: (todo) => {
        this.todos = [todo, ...this.todos];
        this.newTask = '';
        this.loading = false;
      },
      error: () => this.handleError('Could not add the todo item.')
    });
  }

  toggleComplete(todo: Todo): void {
    this.loading = true;
    this.todoService.toggleComplete(todo).subscribe({
      next: (updated) => {
        this.todos = this.todos.map((current) =>
          current.id === updated.id ? updated : current
        );
        this.loading = false;
      },
      error: () => this.handleError('Could not update todo status.')
    });
  }

  deleteTodo(id: number): void {
    this.loading = true;
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.loading = false;
      },
      error: () => this.handleError('Could not delete todo item.')
    });
  }

  trackById(index: number, todo: Todo): number {
    return todo.id;
  }
}
