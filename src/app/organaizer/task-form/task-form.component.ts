import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DateService } from 'src/app/shared/date.service';
import { TaskService, Task } from 'src/app/shared/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  @Output()
  btnClick = new EventEmitter<boolean>;

  form!: FormGroup;

  constructor(private dateService: DateService, private taskService: TaskService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit() {
    const {title} = this.form.value;
    const task: Task = {
      title: title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      done: false
    }


    this.taskService.create(task)
      .subscribe(task => {
        this.taskService.addedTask.next(task);
        this.form.reset();
      });
  }

  toggleForm() {
    this.btnClick.emit(true);
  }

}
