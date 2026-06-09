import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-add-task',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.css'],
})
export class AddTask {
  task = {
    title: '',
    description: '',
    dueDate: ''
  };

  onSubmit(): void {
    console.log('New task submitted', this.task);
    this.task = {
      title: '',
      description: '',
      dueDate: ''
    };
  }
}
