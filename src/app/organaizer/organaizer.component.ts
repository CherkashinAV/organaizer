import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { every, Subscription, switchMap } from 'rxjs';
import { DateService } from '../shared/date.service';
import { TaskService, Task } from '../shared/task.service';

@Component({
  selector: 'app-organaizer',
  templateUrl: './organaizer.component.html',
  styleUrls: ['./organaizer.component.scss']
})
export class OrganaizerComponent implements OnInit {

  @Output()
  btnClick = new EventEmitter<boolean>;

  editable: Task|null = null;

  private subscriptions: Subscription[] = [];

  editForm!: FormGroup;

  date!: any; 

  toDo: Task[] = [];
  done: Task[] = [];


  constructor(private dateService: DateService, private taskService: TaskService) { }

  ngOnInit(): void {

    this.editForm = new FormGroup({
      title: new FormControl('', Validators.required),
    });

    this.date = this.dateService.date;
    const dateSub = this.dateService.date.pipe(
      switchMap(value => this.taskService.load(value))
    ).subscribe(tasks => {
      return tasks.map(task =>
        task.done ? this.done.push(task) : this.toDo.push(task)
      )
    })

    const addedTaskSub = this.taskService.addedTask
      .subscribe(item => {
        if (!item){
          return;
        }
        return this.toDo.push(item)
      });
    this.subscriptions.push(dateSub);
    this.subscriptions.push(addedTaskSub);
  }

  ngOnDestroy(): void {
    this.subscriptions
      .forEach(s => s.unsubscribe());
  }

  drop(event: CdkDragDrop<Task[]>) {
    if(event.container === event.previousContainer) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    else {
      event.container.data === this.toDo ? event.previousContainer.data[event.previousIndex].done = false : event.previousContainer.data[event.previousIndex].done = true;
      this.taskService.update(event.previousContainer.data[event.previousIndex])
      .subscribe(
        data => console.log('patch request success', data),
        err => console.error(err));
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  addTask() {
    this.btnClick.emit(true);
  }

  removeTask(item: Task) {
    this.taskService.remove(item).subscribe(() => {
      this.toDo = this.toDo.filter(t => t.id != item.id)
    }, err => console.error(err));
  }

  editTask(item: Task) {
    this.editable = item;
  }

  submit() {
    const {title} = this.editForm.value;
    (this.editable as Task).title = title;
    console.log(this.editable);
    this.taskService.update(this.editable as Task)
      .subscribe(
        data => console.log('patch request success', data),
        err => console.error(err));
    this.editable = null;
  }
}
