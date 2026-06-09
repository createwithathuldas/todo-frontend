import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Todo } from '../models/todo.model';
import { API_BASE } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE}/todo`;

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  toggleComplete(todo: Todo): Observable<Todo> {
    const updatedTodo: Todo = {
      ...todo,
      isCompleted: !todo.isCompleted,
      completedAt: !todo.isCompleted ? new Date().toISOString() : todo.completedAt
    };
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, updatedTodo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createTodo(task: string): Observable<Todo> {
    const payload = {
      id: 0,
      task,
      userName: 'Guest',
      createdAt: new Date().toISOString(),
      isCompleted: false,
      completedAt: new Date(0).toISOString()
    } as Todo;
    return this.http.post<Todo>(this.apiUrl, payload);
  }
}
