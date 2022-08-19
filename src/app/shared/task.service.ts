import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DateService } from './date.service';

export interface Task {
  id?: string;
  title: string;
  date?: string;
  done: boolean;
}

interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  addedTask: BehaviorSubject<Task|null> = new BehaviorSubject<Task|null>(null);

  static url = environment.dataBaseUrl + 'tasks';

  constructor(private http: HttpClient) { }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TaskService.url}/${task.date}.json`, task)
      .pipe(
        map(res => {
          console.log('Response', res)
          return {...task, id: res.name};
        })
      )
  }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http.get<Task[]>(`${TaskService.url}/${date.format('DD-MM-YYYY')}.json`)
    .pipe(
      map(tasks => {
        if(!tasks){
          return [];
        }
        return Object.keys(tasks).map((key: any) => ({...tasks[key], id: key}));
      })
    )
  }

  update(task: Task): Observable<any> {
    console.log('patching ', task);
    return this.http.patch(`${TaskService.url}/${task.date}/${task.id}.json`, {...task});
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TaskService.url}/${task.date}/${task.id}.json`);
  }

}
